import { format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { Coins, CopyCheck, Droplet, ListTodo } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  day: Date;
  isMobile: boolean;
  tCount: number;
  hCount: number;
  wCount: number;
  mCount: number;
  eventTitle?: string;
  onClick(): void;
}

export function CalendarCell({
  day,
  isMobile,
  tCount,
  hCount,
  wCount,
  mCount,
  eventTitle,
  onClick,
}: Props) {
  const today = new Date();
  const isToday = isSameDay(day, today);

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.container,
        isMobile ? styles.mobileHeight : styles.desktopHeight,
        isMobile ? styles.mobileWidth: styles.desktopWidth,
      ]}
    >
      <Text style={[styles.dayCircle, isToday && styles.todayCircle]}>
        {format(day, "d", { locale: pl })}
      </Text>

      {eventTitle ? (
        <Text numberOfLines={1} style={styles.eventTitle}>
          {eventTitle}
        </Text>
      ) : null}

      <View style={styles.iconRow}>
        <View style={styles.iconItem}>
          <ListTodo size={14} />
          <Text style={styles.countText}> {tCount}</Text>
        </View>
        <View style={styles.iconItem}>
          <CopyCheck size={14} />
          <Text style={styles.countText}> {hCount}</Text>
        </View>
        <View style={styles.iconItem}>
          <Droplet size={14} />
          <Text style={styles.countText}> {wCount}</Text>
        </View>
        <View style={styles.iconItem}>
          <Coins size={14} />
          <Text style={styles.countText}> {mCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  mobileHeight: {
    height: 128,
  },
  desktopHeight: {
    height: 96,
  },
  mobileWidth: {
    width: "100%",
  },
  desktopWidth: {
    width: `${100 / 7.5}%`,
  },
  dayCircle: {
    width: 28,
    height: 28,
    textAlign: "center",
    borderRadius: 14,
    alignSelf: "flex-start",
    lineHeight: 28,
    color: "#000",
  },
  todayCircle: {
    backgroundColor: "#2563EB", // Primary color
    color: "#fff",
  },
  eventTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  iconItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  countText: {
    fontSize: 12,
  },
});
