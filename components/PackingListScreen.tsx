import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Category = {
  title: string;
  items: string[];
};

type Props = {
  title: string;
  categories: Category[];
};

export default function PackingListScreen({ title, categories }: Props) {
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

  const toggle = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>{title}</Text>

      {categories.map((cat) => (
        <View key={cat.title} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{cat.title}</Text>
          <View style={styles.itemGroup}>
            {cat.items.map((item) => {
              const isChecked = checked[item];
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggle(item)}
                  style={styles.itemRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxChecked,
                    ]}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      isChecked && styles.itemTextChecked,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  categoryBlock: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  itemGroup: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  itemText: {
    fontSize: 18,
    color: "#1f2937",
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
});
