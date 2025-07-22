import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomCalendar from "../components/CustomCalendar";
import EventForm from "../components/EventForm";
import type { Event } from "../types";

export default function CalendarScreen() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const userEmail = user?.email || "";

  const openAdd = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kalendarz</Text>
        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={openAdd}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        )}
      </View>

      {showForm ? (
        <EventForm
          userEmail={userEmail}
          initialEvent={editingEvent}
          onEventsChange={closeForm}
          onCancel={closeForm}
        />
      ) : (
        <CustomCalendar onEdit={openEdit} userEmail={userEmail} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  loaderContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
