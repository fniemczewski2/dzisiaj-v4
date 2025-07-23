import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { databases } from "../utils/appwrite";

const DB_ID = "687be7da002f9935927c"; // podmień na swoje ID
const COLLECTION_ID = "water";         // podmień na właściwą kolekcję

export default function WaterTrackerMobile() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [water, setWater] = useState(0)
  const [docId, setDocId] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const userEmail = user?.email || "d";

  useEffect(() => {
    const fetchWater = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
          Query.equal("date", today),
          Query.equal("user_name", userEmail),
        ]);

        const doc = res.documents[0];
        if (doc) {
          setWater(parseFloat(doc.amount));
          setDocId(doc.$id);
        }
      } catch (e) {
        console.error("Błąd pobierania wody:", e);
      } 
    };

    if (userEmail) fetchWater();
  }, [userEmail, today]);

  const handleChange = async (value: number) => {
    setWater(value);

    const payload = {
      date: today,
      user_name: userEmail,
      amount: value,
    };

    try {
      if (docId) {
        await databases.updateDocument(DB_ID, COLLECTION_ID, docId, payload);
      } else {
        const res = await databases.createDocument(
          DB_ID,
          COLLECTION_ID,
          "unique()",
          payload
        );
        setDocId(res.$id);
      }
    } catch (e) {
      console.error("Błąd zapisu spożycia wody:", e);
    }
  };

  return (
    <View style={[styles.container, width >= 768 ? {height: 48} : {height: 24}]}>
        <Feather name="droplet" size={22} color="#3b82f6" />
        <Slider
        value={water}
          onValueChange={handleChange}
          minimumValue={0}
          maximumValue={2}
          step={0.1}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6" 
          style={{
    maxWidth: width >= 768 ? 800 : 300,
    width: '60%',
  }}
      />
        <Text style={styles.label}>
          {water.toFixed(1)} / 2.0 L
        </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal:"auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    maxWidth: 1002
  },
  
  
  label: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});
