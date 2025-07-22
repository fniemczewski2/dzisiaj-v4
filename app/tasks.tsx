import { Query } from "appwrite";
import { addDays, format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  List,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { databases } from "../utils/appwrite";

import { useAuth } from "@/contexts/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskIcons from "../components/TaskIcons";
import TaskList from "../components/TaskList";

const FILTER_OPTIONS = [
  { value: "all", icon: List, title: "Wszystkie", offset: 0 },
  { value: "yesterday", icon: ChevronLeft, title: "Wczoraj", offset: -1 },
  { value: "today", icon: Calendar, title: "Dzisiaj", offset: 0 },
  { value: "tomorrow", icon: ChevronRight, title: "Jutro", offset: 1 },
  { value: "dayAfterTomorrow", icon: ChevronsRight, title: "Pojutrze", offset: 2 },
] as const;


export default function TasksScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const userEmail = user?.email || "";

  const fetchTasks = useCallback(async () => {
  if (!user) return;
  setLoading(true);

  try {
    const filters = [Query.equal("user_email", user.email)];

    if (filter !== "all") {
      const offset = FILTER_OPTIONS.find((f) => f.value === filter)?.offset || 0;
      const date = format(addDays(new Date(), offset), "yyyy-MM-dd");
      filters.push(Query.equal("due_date", date));
    }

    const res = await databases.listDocuments(
      "687be7da002f9935927c",
      "687be801002b3c0253a9",
      filters
    );

    setTasks(res.documents);
  } catch (err) {
    console.log("Błąd przy pobieraniu zadań", err);
  } finally {
    setLoading(false);
  }
}, [user, filter]);


  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
      <Text style={styles.title}>
        Zadania
      </Text>
      {!showForm && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
          <Text style={styles.addButtonText}>Dodaj</Text>
        </TouchableOpacity>
      )}
      </View>
      
    {!showForm && (
      <TaskIcons />
    )}
        

      {showForm && (
        <TaskForm
          onTasksChange={() => {
            fetchTasks();
            setShowForm(false);
          }}
          userEmail={userEmail}
          onCancel={() => setShowForm(false)}
        />
      )}

      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.filterButton,
              filter === opt.value && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(opt.value)}
          >
            <Text
              style={[
                styles.filterText,
                filter === opt.value && styles.activeFilterText,
              ]}
            >
              <opt.icon
                size={18}
                stroke={filter === opt.value ? "#fff" : "#000"}
                style={styles.icon}
              />
            </Text>
          </TouchableOpacity>
        ))}
        </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TaskList
          tasks={tasks}
          userEmail={userEmail}
          onTasksChange={fetchTasks}
          onEdit={(task) => {
            setShowForm(true);
            // Możesz tu przekazać edytowane zadanie do TaskFormMobile przez prop
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginBottom:16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    justifyContent: "center",
  },
  activeFilterButton: {
    backgroundColor: "#3b82f6",
  },
  filterText: {
    color: "#000",
    justifyContent: "center",
  },
  activeFilterText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    paddingBottom:1
  },
  icon: {

  alignSelf: "center",
},
});
