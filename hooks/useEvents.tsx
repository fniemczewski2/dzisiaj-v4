import { Query } from "appwrite";
import {
    addDays,
    addMonths,
    addYears,
    differenceInCalendarDays,
    parseISO,
} from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Event } from "../types";
import { databases } from "../utils/appwrite"; // Twój skonfigurowany klient

export function expandRepeatingEvents(
  events: Event[],
  start: Date,
  end: Date
): Event[] {
  const result: Event[] = [];

  for (const event of events) {
    const originalStart = parseISO(event.start_time);
    const originalEnd = parseISO(event.end_time);
    const durationDays =
      differenceInCalendarDays(originalEnd, originalStart) || 0;
    const repeat = event.repeat || "none";

    if (repeat === "none") {
      for (let i = 0; i <= durationDays; i++) {
        const day = addDays(originalStart, i);
        if (day >= start && day <= end) {
          result.push({
            ...event,
            start_time: day.toISOString(),
            end_time: day.toISOString(),
          });
        }
      }
    } else {
      let currentStart = new Date(originalStart);

      while (currentStart < start) {
        currentStart =
          repeat === "weekly"
            ? addDays(currentStart, 7)
            : repeat === "monthly"
            ? addMonths(currentStart, 1)
            : repeat === "yearly"
            ? addYears(currentStart, 1)
            : addDays(currentStart, 1);
      }

      while (currentStart <= end) {
        for (let i = 0; i <= durationDays; i++) {
          const day = addDays(currentStart, i);
          if (day >= start && day <= end) {
            result.push({
              ...event,
              start_time: day.toISOString(),
              end_time: day.toISOString(),
            });
          }
        }

        currentStart =
          repeat === "weekly"
            ? addDays(currentStart, 7)
            : repeat === "monthly"
            ? addMonths(currentStart, 1)
            : repeat === "yearly"
            ? addYears(currentStart, 1)
            : addDays(currentStart, 1);
      }
    }
  }

  return result;
}

export function useEvents(
  userEmail: string,
  rangeStart: string,
  rangeEnd: string
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

const fetchEvents = useCallback(async () => {
  setLoading(true);
  try {
    const [ownEventsRes, sharedEventsRes] = await Promise.all([
      databases.listDocuments<Event>("your-db-id", "your-collection-id", [
        Query.equal("user_name", userEmail),
      ]),
      databases.listDocuments<Event>("your-db-id", "your-collection-id", [
        Query.equal("share", userEmail),
      ]),
    ]);

    const allEvents: Event[] = [
      ...ownEventsRes.documents,
      ...sharedEventsRes.documents,
    ];

    const unique = Array.from(new Map(allEvents.map(e => [e.$id, e])).values());
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const expanded = expandRepeatingEvents(unique, start, end);
    setEvents(expanded);
  } catch (err) {
    console.error("Błąd pobierania wydarzeń:", err);
  } finally {
    setLoading(false);
  }
}, [userEmail, rangeStart, rangeEnd]);

useEffect(() => {
  if (userEmail) fetchEvents();
}, [fetchEvents, userEmail]);

  return { events, loading, refetch: fetchEvents };
}
