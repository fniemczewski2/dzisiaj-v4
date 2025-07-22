import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BillFormMobile from "../components/BillForm";
import { useAuth } from "../contexts/AuthContext";
import { Bill } from "../types";
import { databases } from "../utils/appwrite";

export default function BillsScreen() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [budgetItems, setBudgetItems] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);

  const fetchBills = useCallback(async () => {
  if (!user) return;
  setLoading(true);

  try {
    const res = await databases.listDocuments(
      "687be7da002f9935927c",
      "687bf0ad002bde5502aa",
      []
    );

    const all: Bill[] = res.documents.map((doc) => ({
      $id: doc.$id,
      amount: doc.amount,
      description: doc.description,
      date: doc.date,
      user_name: doc.user_name,
      include_in_budget: doc.include_in_budget,
    }));

    setBills(all.filter((b) => !b.include_in_budget));
    setBudgetItems(all.filter((b) => b.include_in_budget));
  } catch (err) {
    console.error("Błąd przy pobieraniu rachunków:", err);
  } finally {
    setLoading(false);
  }
}, [user]);


  const handleDelete = async (id: string) => {
    Alert.alert("Usuń rachunek", "Czy na pewno chcesz usunąć?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          await databases.deleteDocument(
            "687be7da002f9935927c",
            "687bf0ad002bde5502aa",
            id
          );
          fetchBills();
        },
      },
    ]);
  };

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const openEdit = (bill: Bill) => {
    setEditing(bill);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Rachunki</Text>
        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={openNew}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        )}
      </View>

      {showForm && (
        <BillFormMobile
          initial={editing ?? undefined}
          onChange={() => {
            setShowForm(false);
            fetchBills();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <ActivityIndicator size="large" />}

      {bills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Do zwrotu</Text>
          {bills.map((bill) => (
            <BillItem
              key={bill.$id}
              bill={bill}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}

      {budgetItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wydatki planowane</Text>
          {budgetItems.map((bill) => (
            <BillItem
              key={bill.$id}
              bill={bill}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function BillItem({
  bill,
  onEdit,
  onDelete,
}: {
  bill: Bill;
  onEdit: (b: Bill) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.billItem}>
      <View>
        <Text style={styles.amountText}>
          {bill.include_in_budget ? "-" : "+"}
          {bill.amount.toFixed(2)} PLN
        </Text>
        <Text style={styles.subtext}>
          {bill.date} | {bill.description}
        </Text>
      </View>
      <View style={styles.billActions}>
        <TouchableOpacity onPress={() => onEdit(bill)}>
          <Feather name="edit" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(bill.$id)}>
          <Feather name="trash-2" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  billItem: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  subtext: {
    fontSize: 12,
    color: "#6b7280",
  },
  billActions: {
    flexDirection: "row",
    gap: 12,
  },
});
