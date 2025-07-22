
import { PlusCircle, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Note } from "../types";
import { databases } from "../utils/appwrite";

interface NoteFormProps {
  userEmail: string;
  onChange: () => void;
  onCancel?: () => void;
  initial?: Note | null;
}

const DATABASE_ID = "YOUR_DATABASE_ID";
const NOTES_COLLECTION_ID = "notes";

const NoteForm: React.FC<NoteFormProps> = ({
  userEmail,
  onChange,
  onCancel,
  initial,
}) => {
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title || "");
  const [itemsText, setItemsText] = useState(initial?.items.join("\n") || "");
  const [bgColor, setBgColor] = useState(initial?.bg_color || "#ffffff");
  const [loading, setLoading] = useState(false);

  const bgColors = [
  "#f9fafb", // zinc
  "#fef9c3", // yellow
  "#dcfce7", // green
  "#cffafe", // cyan
  "#fee2e2", // red
  "#ffffff" 
];

  useEffect(() => {
    if (!initial) {
      setTitle("");
      setItemsText("");
      setBgColor("zinc-50");
    }
  }, [initial]);

  const handleSubmit = async () => {
    setLoading(true);
    const items = itemsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      user_name: userEmail,
      title,
      items,
      bg_color: bgColor,
    };

    try {
      if (isEdit && initial) {
        await databases.updateDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          initial.$id,
          payload
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          "unique()",
          payload
        );
      }

      onChange();
      if (!isEdit) {
        setTitle("");
        setItemsText("");
        setBgColor("zinc-50");
      }
    } catch (err) {
      console.error("Błąd zapisu notatki:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tytuł:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Tytuł notatki"
      />

      <Text style={styles.label}>Treść:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={itemsText}
        onChangeText={setItemsText}
        placeholder="Pozycje listy (jedna na linię)"
        multiline
      />

      <View style={styles.colorPicker}>
        {bgColors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              bgColor === color && styles.colorCircleSelected,
            ]}
            onPress={() => setBgColor(color)}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>
                      {isEdit ? "Zapisz  " : "Dodaj  "}
                    </Text>
                    {isEdit ? <Save size={20} color="white" /> : <PlusCircle size={20} color="white" />}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text>Anuluj</Text>
          </TouchableOpacity>
        )}

        {loading && <ActivityIndicator size="small" color="#888" />}
      </View>
    </View>
  );
};

export default NoteForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignSelf: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 6,
    width: "100%",
    maxWidth: 360,
    marginBottom: 16
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  colorPicker: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#3b82f6",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  submitText: {
    color: "#fff",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
