import { PlusCircle, Save } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { databases } from "../utils/appwrite";

interface Props {
  initial?: any;
  onChange: () => void;
  onCancel?: () => void;
}

export default function BillFormMobile({ initial, onChange, onCancel }: Props) {
  const { user } = useAuth();
  const isEdit = !!initial;
  const today = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState(String(initial?.amount || "0"));
  const [description, setDescription] = useState(initial?.description || "");
  const [date, setDate] = useState(initial?.date || today);
  const [includeInBudget, setIncludeInBudget] = useState(
    initial?.include_in_budget || false
  );
  const [loading, setLoading] = useState(false);

  

  const handleSave = async () => {
    if (!user) { return null; }
    setLoading(true);
    const payload = {
      user_name: user.email,
      amount: parseFloat(amount),
      description,
      date,
      include_in_budget: includeInBudget,
    };

    try {
      if (isEdit) {
        await databases.updateDocument(
          "687be7da002f9935927c", // zamień na swoje DB ID
          "687bf0ad002bde5502aa", // zamień na kolekcję BILL
          initial.$id,
          payload
        );
      } else {
        await databases.createDocument(
          "687be7da002f9935927c",
          "687bf0ad002bde5502aa",
          "unique()",
          payload
        );
      }
      onChange();
    } catch (e) {
      console.error("Błąd rachunku:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large"/>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="Kwota"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Opis"
        style={styles.input}
      />
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Data (YYYY-MM-DD)"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Switch
          value={includeInBudget}
          onValueChange={setIncludeInBudget}
        />
        <Text style={styles.switchLabel}>Uwzględnij w budżecie</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
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
}

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
    elevation: 4,
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
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
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
