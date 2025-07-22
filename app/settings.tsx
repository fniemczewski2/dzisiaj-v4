
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Settings } from "../types";
import { databases } from "../utils/appwrite";

export default function SettingsScreen() {
  const { user } = useAuth();
  const userEmail = user?.email || "";

  const [settings, setSettings] = useState<Settings>({
  user_name: userEmail,
  sort_order: "priority",
  show_completed: true,
  show_habits: true,
  show_water_tracker: true,
  show_budget_items: false,
  users: [],
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const { logout } = useAuth();
  const router = useRouter();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await databases.listDocuments(
        "[DB_ID]",
        "[COLLECTION_SETTINGS]",
        [`equal("user_name", "${userEmail}")`]
      );

      if (res.total > 0) {
        const doc = res.documents[0];
        setSettings({
          user_name: doc.user_name,
          sort_order: doc.sort_order,
          show_completed: doc.show_completed,
          show_habits: doc.show_habits,
          show_water_tracker: doc.show_water_tracker,
          show_budget_items: doc.show_budget_items,
          users: doc.users,
        });
      }
    } catch (err) {
      console.error("Błąd pobierania ustawień:", err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) fetchSettings();
  }, [fetchSettings, userEmail]);

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...settings };

    try {
      await databases.createDocument(
        "[DB_ID]",
        "[COLLECTION_SETTINGS]",
        "unique()",
        payload
      );
      Alert.alert("Sukces", "Ustawienia zapisane.");
    } catch (err) {
      console.error("Błąd zapisu:", err);
    } finally {
      setSaving(false);
    }
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationStatus("Brak uprawnień do lokalizacji.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocationStatus(
      `Lokalizacja: ${loc.coords.latitude.toFixed(3)}, ${loc.coords.longitude.toFixed(3)}`
    );
  };

  const addUser = () => {
    if (settings.users.length < 10) {
      setSettings((prev) => ({ ...prev, users: [...prev.users, ""] }));
    }
  };

  const removeUser = (index: number) => {
    const updated = settings.users.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, users: updated }));
  };

  const updateUser = (index: number, value: string) => {
    const updated = [...settings.users];
    updated[index] = value;
    setSettings((prev) => ({ ...prev, users: updated }));
  };
  
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ustawienia</Text>

      <Text style={styles.subHeader}>Sortowanie zadań</Text>
      {["priority", "due_date", "alphabetical", "due_date_alphabetical"].map((val) => (
        <TouchableOpacity
          key={val}
          style={[
            styles.sortOption,
            settings.sort_order === val && styles.activeOption,
          ]}
          onPress={() => setSettings((s) => ({ ...s, sort_order: val }))}
        >
          <Text>{val}</Text>
        </TouchableOpacity>
      ))}

      {[
        { key: "show_completed", label: "Pokaż wykonane zadania" },
        { key: "show_habits", label: "Pokaż nawyki" },
        { key: "show_water_tracker", label: "Pokaż tracker wody" },
        { key: "show_budget_items", label: "Pokaż budżet" },
      ].map((item) => (
        <View key={item.key} style={styles.row}>
          <Text>{item.label}</Text>
          <Switch
            value={settings[item.key as keyof typeof settings] as boolean}
            onValueChange={(v) =>
              setSettings((s) => ({ ...s, [item.key]: v }))
            }
          />
        </View>
      ))}

      <Text style={styles.subHeader}>Znajomi</Text>
      {settings.users.map((u, idx) => (
        <View key={idx} style={styles.friendRow}>
          <TextInput
            style={styles.input}
            value={u}
            placeholder="Email znajomego"
            onChangeText={(val) => updateUser(idx, val)}
          />
          <TouchableOpacity onPress={() => removeUser(idx)}>
            <Text style={styles.remove}>Usuń</Text>
          </TouchableOpacity>
        </View>
      ))}
      {settings.users.length < 10 && (
        <TouchableOpacity onPress={addUser}>
          <Text style={styles.addFriend}>+ Dodaj znajomego</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? "Zapisywanie..." : "Zapisz ustawienia"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Lokalizacja</Text>
      <TouchableOpacity onPress={requestLocation} style={styles.locationButton}>
        <Text>Poproś o lokalizację</Text>
      </TouchableOpacity>
      {locationStatus ? <Text>{locationStatus}</Text> : null}

      <Text style={styles.subHeader}>Użytkownik</Text>
      <Text>Email: {userEmail}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Wyloguj się</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  sortOption: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  activeOption: {
    borderColor: "#3b82f6",
    backgroundColor: "#e0edff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  remove: {
    color: "#dc2626",
  },
  addFriend: {
    color: "#2563eb",
    marginTop: 4,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  locationButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
