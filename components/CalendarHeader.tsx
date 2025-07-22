import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  currentDate: Date;
  onPrev(): void;
  onNext(): void;
  onToday(): void;
}

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity
          onPress={onPrev}
          accessibilityLabel="Poprzedni miesiąc"
          style={styles.button}
        >
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>

        <Text style={styles.dateText}>
          {format(currentDate, "LLLL yyyy", { locale: pl })}
        </Text>

        <TouchableOpacity
          onPress={onNext}
          accessibilityLabel="Następny miesiąc"
          style={styles.button}
        >
          <ChevronRight color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: "#2563EB", // primary
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
  },
});
