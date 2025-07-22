import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Calendar,
  Check,
  Clock,
  Edit2,
  MapPin,
  Trash2,
  User,
  X
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Event, Task } from "../types";


interface Props {
  selectedDate: string;
  tasks: Task[];
  events?: Event[];
  onBack: () => void;
  onEdit?: (event: Event) => void;
  onEventsChange: () => void;
}

export function CalendarDayDetails({
  selectedDate,
  tasks,
  events = [],
  onBack,
  onEdit,
  onEventsChange,
}: Props) {
  const handleDelete = (eventId: string) => {
    Alert.alert(
      "Potwierdzenie",
      "Czy na pewno chcesz usunąć to wydarzenie?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => {
            // Tu zamiast Supabase — np. Appwrite.deleteDocument(...)
            // Wywołaj onEventsChange() po zakończeniu usuwania
            onEventsChange();
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
         <Calendar size={20} color="white" /> 
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {format(parseISO(selectedDate), "d MMMM yyyy", { locale: pl })} 
        </Text>
        <View style={{width: 36}}></View>
      </View>

      {events.length > 0 && (
        <View style={styles.eventList}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventRow}>
                <View style={styles.eventDetails}>
                  <View style={styles.detailItem}>
                    <Clock size={16} />
                    <Text style={styles.detailText}>
                      {format(parseISO(event.start_time), "HH:mm")} –{" "}
                      {format(parseISO(event.end_time), "HH:mm")}
                    </Text>
                  </View>

                  {event.place && (
                    <View style={styles.detailItem}>
                      <MapPin size={16} />
                      <Text style={styles.detailText}>{event.place}</Text>
                    </View>
                  )}

                  {event.share !== "null" && event.share && (
                    <View style={styles.detailItem}>
                      <User size={16} />
                      <Text style={styles.detailText}>{event.share}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.actions}>
                  {onEdit && (
                    <TouchableOpacity onPress={() => onEdit(event)} style={styles.actionBtn}>
                      <Edit2 size={20} color="#2563EB" />
                      <Text style={styles.actionText}>Edytuj</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDelete(event.id)}
                    style={styles.actionBtn}
                  >
                    <Trash2 size={20} color="#DC2626" />
                    <Text style={[styles.actionText, { color: "#DC2626" }]}>Usuń</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {event.description && (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>{event.description}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.taskSection}>
        <Text style={styles.taskHeader}>Zadania</Text>
        {tasks.length ? (
          <View style={styles.taskList}>
            {tasks.map((t) => (
              <View key={t.id} style={styles.taskItem}>
                {t.status === "done" ? (
                  <Check size={20} color="green" />
                ) : (
                  <X size={20} color="red" />
                )}
                <Text style={styles.taskText}>
                  {t.priority} | {t.title}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noTasks}>Brak zadań</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  backButton: {
    backgroundColor: "#2563EB",
    borderRadius: 6,
    padding: 8,
  },
  dateText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  eventList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
    gap: 8,
  },
  eventTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
  },
  actions: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    alignItems: "center",
    marginVertical: 4,
  },
  actionText: {
    fontSize: 10,
    color: "#2563EB",
  },
  descriptionBox: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 6,
  },
  descriptionText: {
    fontSize: 13,
  },
  taskSection: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  taskHeader: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 8,
  },
  taskList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taskText: {
    fontSize: 14,
    flexShrink: 1,
  },
  noTasks: {
    fontStyle: "italic",
    color: "#555",
  },
});
