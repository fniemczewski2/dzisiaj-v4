import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Task } from "../types";
import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  userEmail: string;
  onTasksChange: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({
  tasks,
  userEmail,
  onTasksChange,
  onEdit,
}: Props) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          userEmail={userEmail}
          onTasksChange={onTasksChange}
          onEdit={onEdit}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});
