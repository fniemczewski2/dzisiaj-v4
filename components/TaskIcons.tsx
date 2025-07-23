import { useAuth } from "@/contexts/AuthContext";
import { ID, Models, Query } from "appwrite";
import {
  Bath,
  Briefcase,
  Dumbbell,
  Home,
  Languages,
  Leaf,
  Pill,
  Users,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { databases } from "../utils/appwrite"; // instancja Appwrite Databases
import WaterTrackerMobile from "./WaterTrackerMobile";

type HabitKey =
  | "pills"
  | "bath"
  | "workout"
  | "friends"
  | "work"
  | "housework"
  | "plants"
  | "duolingo";

const items: { key: HabitKey; Icon: React.ComponentType<any> }[] = [
  { key: "pills", Icon: Pill },
  { key: "bath", Icon: Bath },
  { key: "workout", Icon: Dumbbell },
  { key: "friends", Icon: Users },
  { key: "work", Icon: Briefcase },
  { key: "housework", Icon: Home },
  { key: "plants", Icon: Leaf },
  { key: "duolingo", Icon: Languages },
];

const initialState: Record<HabitKey, boolean> = {
  pills: false,
  bath: false,
  workout: false,
  friends: false,
  work: false,
  housework: false,
  plants: false,
  duolingo: false,
};

export default function TaskIcons() {
  const { user } = useAuth();
  const [done, setDone] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const { width } = useWindowDimensions();
  const userEmail = user?.email || "d";
  const fetchHabits = useCallback(async () => {

    setLoading(true);

    try {
      const response = await databases.listDocuments(
        "your-database-id",
        "daily_habits",
        [
          // filtruj po użytkowniku i dacie
          Query.equal("user_email", userEmail),
          Query.equal("date", today),
        ]
      );

      const data = response.documents[0] as Models.Document | undefined;
      if (data) {
        const state: Record<HabitKey, boolean> = {
          pills: data.pills,
          bath: data.bath,
          workout: data.workout,
          friends: data.friends,
          work: data.work,
          housework: data.housework,
          plants: data.plants,
          duolingo: data.duolingo,
        };
        setDone(state);
      }
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    } finally {
      setLoading(false);
    }
  }, [userEmail, today]);

  const toggleHabit = async (key: HabitKey) => {
    const newValue = !done[key];
    const updated = { ...done, [key]: newValue };
    setDone(updated);

    try {
      const response = await databases.listDocuments(
        "your-database-id",
        "daily_habits",
        [
          Query.equal("user_email", userEmail),
          Query.equal("date", today),
        ]
      );

      const existingDoc = response.documents[0];

      if (existingDoc) {
        await databases.updateDocument(
          "your-database-id",
          "daily_habits",
          existingDoc.$id,
          { [key]: newValue }
        );
      } else {
        await databases.createDocument(
          "your-database-id",
          "daily_habits",
          ID.unique(),
          {
            user_email: userEmail,
            date: today,
            ...updated,
          }
        );
      }
    } catch (err) {
      console.error("Błąd aktualizacji danych:", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  });

  return (
    <View style={styles.container}>
    <View style={styles.grid}>
      {
        items.map(({ key, Icon }) => (
          <TouchableOpacity
            key={key}
            disabled={loading}
            onPress={() => toggleHabit(key)}
            style={[
              styles.button,
              done[key] && styles.activeButton,
              loading && styles.disabledButton,
              width >= 768 ? { flex: 1, maxWidth: 120} : {height: 32}, 
            ]}
          >
            <Icon size={[width >= 768 ? (24) : (18)]} strokeWidth={2} color={done[key] ? "#195f22ff" : "#777" }/>
          </TouchableOpacity>
        ))
      }
      
     </View>
     <WaterTrackerMobile />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    borderRadius: 12,
    justifyContent: "space-between",
    marginVertical: 4,
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
  },
  button: {
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: "#b2f2bb",
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
  },
});
