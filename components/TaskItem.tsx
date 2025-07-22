import { format, parseISO } from "date-fns";
import { Check, Edit2, LucideIcon, Trash2 } from "lucide-react-native";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../types";
import { databases } from "../utils/appwrite";

interface Props {
  task: Task;
  userEmail: string;
  onTasksChange: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({
  task,
  userEmail,
  onTasksChange,
  onEdit,
}: Props) {
  const isDone = task.status === "done";

  const confirmDelete = () => {
    Alert.alert("Potwierdzenie", "Czy na pewno chcesz usunąć to zadanie?", [
      { text: "Anuluj", style: "cancel" },
      { text: "Usuń", style: "destructive", onPress: handleDelete },
    ]);
  };

  const handleDelete = async () => {
    await databases.deleteDocument("your-database-id", "tasks", task.id);
    onTasksChange();
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const updateStatus = async (status: "accepted" | "done") => {
    await databases.updateDocument("your-database-id", "tasks", task.id, {
      status,
    });
    onTasksChange();
  };

  const highlightStyle =
    task.priority === 1 || new Date(task.deadline_date) < new Date()
      ? styles.urgent
      : undefined;

  return (
    <View style={[styles.container, highlightStyle]}>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isDone && styles.done,
            task.priority === 1 && styles.urgentText,
          ]}
        >
          {task.priority} | {task.title}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.meta}>
            {task.due_date
              ? format(parseISO(task.due_date), "dd.MM.yyyy")
              : ""}
            {task.deadline_date && (
              <> | {format(parseISO(task.deadline_date), "dd.MM.yyyy")}</>
            )}
          </Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>

        <View style={styles.actions}>
          {isDone ? (
            <IconButton Icon={Trash2} label="Usuń" onPress={confirmDelete} color="#dc2626" />
          ) : task.user_name !== userEmail &&
            task.status === "waiting_for_acceptance" ? (
            <>
              <IconButton
                Icon={Check}
                label="Akceptuj"
                onPress={() => updateStatus("accepted")}
                color="#16a34a"
              />
              <IconButton
                Icon={Trash2}
                label="Usuń"
                onPress={confirmDelete}
                color="#dc2626"
              />
            </>
          ) : (
            <>
              <IconButton
                Icon={Check}
                label="Zrobione"
                onPress={() => updateStatus("done")}
                color="#16a34a"
              />
              <IconButton
                Icon={Edit2}
                label="Edytuj"
                onPress={handleEdit}
                color="#2563eb"
              />
              <IconButton
                Icon={Trash2}
                label="Usuń"
                onPress={confirmDelete}
                color="#dc2626"
              />
            </>
          )}
        </View>

        {(task.description ||
          task.status === "accepted" ||
          task.status === "waiting_for_acceptance") && (
          <Text style={styles.description}>
            {task.priority === 1 && "PILNE!\n"}
            {task.description}
            {"\n"}
            {task.for_user === userEmail
              ? `Zlecone przez: ${task.user_name}`
              : `Zlecone dla: ${task.for_user}`}
          </Text>
        )}
      </View>
    </View>
  );
}

function IconButton({
  Icon,
  label,
  onPress,
  color,
}: {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon color={color} size={20} />
      <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    maxWidth: 400,
    width: "100%",
  },
  urgent: {
    borderColor: "#b91c1c",
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  urgentText: {
    color: "#b91c1c",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#4b5563",
  },
  category: {
    fontSize: 13,
    color: "#374151",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 6,
  },
  button: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  description: {
    marginTop: 8,
    backgroundColor: "#f3f4f6",
    padding: 6,
    borderRadius: 6,
    fontSize: 14,
  },
});
