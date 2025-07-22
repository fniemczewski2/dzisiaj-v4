import { Picker } from "@react-native-picker/picker";
import { PlusCircleIcon, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSettings } from "../hooks/useSettings";
import { databases } from "../utils/appwrite"; // → twój skonfigurowany Appwrite client

interface Event {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  place?: string;
  share?: string;
  repeat: "none" | "weekly" | "monthly" | "yearly";
  user_name: string;
}

interface EventsFormProps {
  userEmail: string;
  initialEvent?: Event | null;
  onEventsChange: () => void;
  onCancel?: () => void;
}

export default function EventForm({
  userEmail,
  initialEvent = null,
  onEventsChange,
  onCancel,
}: EventsFormProps) {
  const { settings } = useSettings(userEmail);
  const userOptions = settings?.users ?? [];

  const isEdit = initialEvent !== null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [place, setPlace] = useState("");
  const [share, setShare] = useState("null");
  const [repeat, setRepeat] = useState<Event["repeat"]>("none");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || "");
      setStartTime(initialEvent.start_time.slice(0, 16));
      setEndTime(initialEvent.end_time.slice(0, 16));
      setPlace(initialEvent.place || "");
      setShare(initialEvent.share || "null");
      setRepeat(initialEvent.repeat);
    }
  }, [initialEvent]);

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) {
      Alert.alert("Błąd", "Tytuł, początek i koniec wydarzenia są wymagane.");
      return;
    }

    setLoading(true);

    const payload: Omit<Event, "id"> = {
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      place,
      share: share === "null" ? "" : share,
      repeat,
      user_name: userEmail,
    };

    try {
      if (isEdit && initialEvent?.id) {
        await databases.updateDocument(
          "your-database-id",
          "your-collection-id",
          initialEvent.id,
          payload
        );
      } else {
        await databases.createDocument(
          "your-database-id",
          "your-collection-id",
          "unique()", // auto ID
          payload
        );
      }

      onEventsChange();
      if (onCancel) onCancel();

      if (!isEdit) {
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setPlace("");
        setShare("null");
        setRepeat("none");
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zapisać wydarzenia.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Tytuł:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Tytuł wydarzenia"
      />

      <Text style={styles.label}>Opis:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Opis wydarzenia"
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Początek:</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="YYYY-MM-DDTHH:mm"
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Koniec:</Text>
          <TextInput
            style={styles.input}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="YYYY-MM-DDTHH:mm"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Miejsce:</Text>
          <TextInput
            style={styles.input}
            value={place}
            onChangeText={setPlace}
            placeholder="np. Zoom"
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Udostępnij (email):</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={share}
              onValueChange={(value) => setShare(value)}
            >
              <Picker.Item label="Nie udostępniaj" value="null" />
              {userOptions.map((email: string) => (
                <Picker.Item key={email} label={email} value={email} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Powtarzaj:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={repeat}
          onValueChange={(value) => setRepeat(value)}
        >
          <Picker.Item label="Nie" value="none" />
          <Picker.Item label="Co tydzień" value="weekly" />
          <Picker.Item label="Co miesiąc" value="monthly" />
          <Picker.Item label="Co rok" value="yearly" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isEdit ? "Zapisz" : "Dodaj"}
          </Text>
          {isEdit ? <Save size={18} color="white" /> : <PlusCircleIcon size={18} color="white" />}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text>Anuluj</Text>
          </TouchableOpacity>
        )}

        {loading && <ActivityIndicator size="small" color="#555" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
});
