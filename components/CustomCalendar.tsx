import {
    addDays,
    addMonths,
    addWeeks,
    format,
    startOfWeek,
    subMonths,
    subWeeks,
} from "date-fns";
import { pl } from "date-fns/locale";
import React, { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    useWindowDimensions
} from "react-native";
import { useCalendarData } from "../hooks/useCalendar";
import { useEvents } from "../hooks/useEvents";
import { useSettings } from "../hooks/useSettings";
import { useTasks } from "../hooks/useTasks";
import { Event } from "../types";
import { generateCalendarDays } from "../utils/calendar";
import { CalendarDayDetails } from "./CalendarDayDetails";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";

function generateWeekDays(date: Date, weekStartsOn: 1 | 0 = 1): Date[] {
  const start = startOfWeek(date, { locale: pl, weekStartsOn });
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  return days;
}

interface Props {
  onEdit: (event: Event) => void;
  userEmail: string;
}

export default function CustomCalendar({ onEdit, userEmail }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const { settings } = useSettings(userEmail);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");

  const days = isMobile
    ? generateWeekDays(currentDate)
    : generateCalendarDays(currentDate);

  const rangeStart = format(addDays(days[0], -31), "yyyy-MM-dd");
  const rangeEnd = format(addDays(days[days.length - 1], 31), "yyyy-MM-dd");

  const { tasksCount, habitCounts, waterCounts, moneyCounts } =
    useCalendarData(userEmail, rangeStart, rangeEnd);

  const {
    tasks,
    loading: loadingTasks,
    fetchTasks,
  } = useTasks(userEmail, settings);

  const { events, loading, refetch } = useEvents(
    userEmail,
    rangeStart,
    rangeEnd
  );

  const groupedEvents = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const ev of events) {
      const key = ev.start_time.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  useEffect(() => {
    if (settings) fetchTasks();
  }, [settings, fetchTasks]);

  const detailTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((t) => t.due_date?.slice(0, 10) === selectedDate);
  }, [tasks, selectedDate]);

  const detailEvents = groupedEvents[selectedDate] || [];

  const onPrev = () =>
    isMobile
      ? setCurrentDate((d) => subWeeks(d, 1))
      : setCurrentDate((d) => subMonths(d, 1));

  const onNext = () =>
    isMobile
      ? setCurrentDate((d) => addWeeks(d, 1))
      : setCurrentDate((d) => addMonths(d, 1));

  const onToday = () => setCurrentDate(new Date());

  const onDateClick = (dateStr: string) => setSelectedDate(dateStr);
  const onBack = () => {
    console.log(selectedDate)
    setSelectedDate("");
    console.log(selectedDate)
  }

//   if (!settings || loading || loadingTasks) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!selectedDate ? (
        <>
          <CalendarHeader
            currentDate={currentDate}
            onPrev={onPrev}
            onNext={onNext}
            onToday={onToday}
          />
          <CalendarGrid
            days={days}
            isMobile={isMobile}
            tasksCount={tasksCount}
            habitCounts={habitCounts}
            waterCounts={waterCounts}
            moneyCounts={moneyCounts}
            events={groupedEvents}
            onDateClick={onDateClick}
          />
        </>
      ) : (
        <CalendarDayDetails
          selectedDate={selectedDate}
          tasks={detailTasks}
          events={detailEvents}
          onEdit={onEdit}
          onBack={onBack}
          onEventsChange={refetch}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  loaderContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
