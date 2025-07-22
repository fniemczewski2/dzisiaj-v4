import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { PlusCircle, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSettings } from "../hooks/useSettings";
import { Task } from "../types";
import { databases } from "../utils/appwrite";

interface Props {
  userEmail: string;
  initialTask?: Task | null;
  onTasksChange: () => void;
  onCancel?: () => void;
}

export default function TaskForm({
  userEmail,
  initialTask = null,
  onTasksChange,
  onCancel,
}: Props) {
  const isEdit = !!initialTask;
  const { settings } = useSettings(userEmail);

  const [title, setTitle] = useState("");
  const [forUser, setForUser] = useState(userEmail);
  const [category, setCategory] = useState("inne");
  const [priority, setPriority] = useState("5");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [deadlineDate, setDeadlineDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const userOptions = settings?.users || [];

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setForUser(initialTask.for_user);
      setCategory(initialTask.category);
      setPriority(String(initialTask.priority));
      setDescription(initialTask.description || "");
      setDueDate(new Date(initialTask.due_date || new Date()));
      setDeadlineDate(new Date(initialTask.deadline_date || new Date()));
    }
  }, [initialTask]);

  const handleSubmit = async () => {
    if (!title) return;
    setLoading(true);

    const nextStatus =
      forUser !== userEmail ? "waiting_for_acceptance" : "pending";

    const payload = {
      title,
      user_name: userEmail,
      for_user: forUser,
      category,
      priority: Number(priority),
      description,
      due_date: dueDate.toISOString(),
      deadline_date: deadlineDate.toISOString(),
      status: nextStatus,
    };

    try {
      if (isEdit && initialTask?.$id) {
        await databases.updateDocument("dzisiajv4", "tasks", initialTask.$id, payload);
      } else {
        await databases.createDocument("dzisiajv4", "tasks", "unique()", payload);
      }
      onTasksChange();
      onCancel?.();
    } catch (err) {
      console.error("Błąd zapisu zadania:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Tytuł:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Dla:</Text>
      <Picker selectedValue={forUser} onValueChange={setForUser} style={styles.input}>
        <Picker.Item label="mnie" value={userEmail} />
        {userOptions.map((email) => (
          <Picker.Item key={email} label={email} value={email} />
        ))}
      </Picker>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Kategoria:</Text>
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
            {[
              "edukacja", "praca", "osobiste", "aktywizm", "przyjaciele",
              "zakupy", "podróże", "dostawa", "święta", "inne"
            ].map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Priorytet:</Text>
          <TextInput
            style={styles.input}
            value={priority}
            onChangeText={setPriority}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Data wykonania:</Text>
          <DateTimePicker
            mode="date"
            value={dueDate}
            onChange={(_, date) => date && setDueDate(date)}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Deadline:</Text>
          <DateTimePicker
            mode="date"
            value={deadlineDate}
            onChange={(_, date) => date && setDeadlineDate(date)}
          />
        </View>
      </View>

      <Text style={styles.label}>Opis:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isEdit ? "Zapisz" : "Dodaj"}
          </Text>
          {isEdit ? <Save size={20} color="white" /> : <PlusCircle size={20} color="white" />}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Anuluj</Text>
          </TouchableOpacity>
        )}

        {loading && <ActivityIndicator size="small" color="#555" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  half: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  submitBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: "white",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
  },
});
