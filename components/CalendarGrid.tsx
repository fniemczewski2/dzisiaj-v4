import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Event } from "../types";
import { CalendarCell } from "./CalendarCell";

interface Props {
  days: Date[];
  isMobile: boolean;
  tasksCount: Record<string, number>;
  habitCounts: Record<string, number>;
  waterCounts: Record<string, number>;
  moneyCounts: Record<string, number>;
  events?: Record<string, Event[]>;
  onDateClick(dateStr: string): void;
}

export default function CalendarGrid({
  days,
  isMobile,
  tasksCount,
  habitCounts,
  waterCounts,
  moneyCounts,
  events,
  onDateClick,
}: Props) {
  const weeks: Date[][] = isMobile ? [days] : [];
  const DAY_NAMES = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
  if (!isMobile) {
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
  }

  return (
    <View>
      {!isMobile && (
        <View style={styles.weekHeader}>
          {DAY_NAMES.map((dayName) => (
            <Text key={dayName} style={styles.dayName}>
              {dayName}
            </Text>
          ))}
        </View>
      )}

      <View
        style={[
          styles.gridContainer,
          isMobile ? styles.mobileGrid : styles.desktopGrid,
        ]}
      >
        {weeks.flat().map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const eventTitle = events?.[dateStr]?.[0]?.title;
          return (
            <CalendarCell
              key={dateStr}
              day={day}
              isMobile={isMobile}
              tCount={tasksCount[dateStr] || 0}
              hCount={habitCounts[dateStr] || 0}
              wCount={waterCounts[dateStr] || 0}
              mCount={moneyCounts[dateStr] || 0}
              eventTitle={eventTitle}
              onClick={() => onDateClick(dateStr)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  gridContainer: {
    gap: 4,
    
  },
  desktopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mobileGrid: {
    flexDirection: "column",
  },
});
