import { Query } from "appwrite";
import { useRouter } from "expo-router";
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
import NoteForm from "../components/NoteForm";
import { NoteList } from "../components/NoteList";
import { useAuth } from "../contexts/AuthContext";
import { Note } from "../types";
import { databases } from "../utils/appwrite";

const DB_ID = "687be7da002f9935927c";
const COLLECTION_NOTES = "687be801002b3c0253aa"; // przykładowy ID

export default function NotesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const userEmail = user?.email || "";

  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTION_NOTES, [
        Query.equal("user_email", userEmail),
      ]);

      const mappedNotes: Note[] = res.documents.map((doc) => ({
        $id: doc.$id,
        title: doc.title,
        items: doc.items,
        bg_color: doc.bg_color,
        user_name: doc.user_name,
      }));

      setNotes(mappedNotes);
    } catch (err) {
      console.error("Błąd przy pobieraniu notatek:", err);
    }
    finally {
      setLoading(false);
    }
  }, [userEmail]);

  const handleDelete = (id: string) => {
    Alert.alert("Usuń notatkę", "Czy na pewno chcesz usunąć?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          await databases.deleteDocument(DB_ID, COLLECTION_NOTES, id);
          fetchNotes();
        },
      },
    ]);
  };

  const openNew = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notatki</Text>
        <View style={styles.subNav}>
        <TouchableOpacity
          onPress={() => router.push("../notes/backpack")}
          style={styles.navButton}
        >
          <Text>Plecak</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("../notes/suitcase")}
          style={styles.navButton}
        >
          <Text>Walizka</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openNew} style={styles.addButton}>
          <Text style={styles.addButtonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>     

      {showForm && (
        <NoteForm
        userEmail={userEmail}
          initial={editingNote}
          onChange={() => {
            fetchNotes();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <NoteList notes={notes} onEdit={openEdit} onDelete={handleDelete} />
      {loading && 
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  subNav: {
    flexDirection: "row",
    gap:8

  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    justifyContent: "center",
  },
});
