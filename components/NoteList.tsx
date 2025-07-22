import { Edit2, Trash2 } from "lucide-react-native";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Note } from "../types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.$id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={[styles.noteCard, getBgStyle(item.bg_color)]}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.itemList}>
            {item.items.map((it, index) => (
              <Text key={index} style={styles.listItem}>
                • {it}
              </Text>
            ))}
          </View>

          <View style={styles.actions}>
            <IconButton
              Icon={Edit2}
              label="Edytuj"
              color="#2563eb"
              onPress={() => onEdit(item)}
            />
            <IconButton
              Icon={Trash2}
              label="Usuń"
              color="#dc2626"
              onPress={() => onDelete(item.$id)}
            />
          </View>
        </View>
      )}
    />
  );
}

function IconButton({
  Icon,
  label,
  color,
  onPress,
}: {
  Icon: React.ComponentType<{ color: string; size?: number }>;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      <Icon color={color} size={20} />
      <Text style={[styles.iconLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function getBgStyle(bg: string) {
  const map: Record<string, any> = {
    yellow: { backgroundColor: "#fef08a" },
    blue: { backgroundColor: "#bfdbfe" },
    green: { backgroundColor: "#bbf7d0" },
    pink: { backgroundColor: "#fbcfe8" },
    gray: { backgroundColor: "#e5e7eb" },
    white: { backgroundColor: "#ffffff" },
  };

  return map[bg] || { backgroundColor: "#ffffff" };
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
    alignItems: "center",
  },
  noteCard: {
    width: "100%",
    maxWidth: 360,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemList: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  iconButton: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
