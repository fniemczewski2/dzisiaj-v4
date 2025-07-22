import { Query } from "appwrite";
import { useCallback, useState } from "react";
import { Settings, Task } from "../types";
import { databases } from "../utils/appwrite"; // Appwrite client

export function useTasks(userEmail: string, settings: Settings | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!settings) return;

    setLoading(true);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      const [ownTasksRes, assignedTasksRes] = await Promise.all([
        databases.listDocuments<Task>("your-database-id", "tasks", [
          Query.equal("user_name", userEmail),
          Query.greaterThanEqual("due_date", oneMonthAgo.toISOString()),
        ]),
        databases.listDocuments<Task>("your-database-id", "tasks", [
          Query.equal("for_user", userEmail),
          Query.greaterThanEqual("due_date", oneMonthAgo.toISOString()),
        ]),
      ]);

      const allTasks = [
        ...ownTasksRes.documents,
        ...assignedTasksRes.documents,
      ];

      // Unikalne ID (jeśli task przypisany jako user i for_user)
      const uniqueTasks = Array.from(
        new Map(allTasks.map((task) => [task.$id, task])).values()
      );

      // Filtruj "done" jeśli ustawienie nie pozwala
      const filteredTasks = settings.show_completed
        ? uniqueTasks
        : uniqueTasks.filter((t) => t.status !== "done");

      const getPriority = (task: Task) =>
        task.status === "waiting for acceptance" ? 0 : 1;

      const sorted = [...filteredTasks];

      switch (settings.sort_order) {
        case "due_date":
          sorted.sort((a, b) => {
            const aP = getPriority(a);
            const bP = getPriority(b);
            if (aP !== bP) return aP - bP;

            return (
              new Date(a.due_date ?? 0).getTime() -
              new Date(b.due_date ?? 0).getTime()
            );
          });
          break;

        case "due_date_alphabetical":
          sorted.sort((a, b) => {
            const aP = getPriority(a);
            const bP = getPriority(b);
            if (aP !== bP) return aP - bP;

            const dateDiff =
              new Date(a.due_date ?? 0).getTime() -
              new Date(b.due_date ?? 0).getTime();
            if (dateDiff !== 0) return dateDiff;

            return (a.title || "").localeCompare(b.title || "");
          });
          break;

        case "priority":
          sorted.sort((a, b) => {
            const aP = getPriority(a);
            const bP = getPriority(b);
            if (aP !== bP) return aP - bP;

            return (a.priority ?? Infinity) - (b.priority ?? Infinity);
          });
          break;

        default:
          sorted.sort((a, b) => {
            const aP = getPriority(a);
            const bP = getPriority(b);
            if (aP !== bP) return aP - bP;

            return (a.title || "").localeCompare(b.title || "");
          });
      }

      // Na końcu przesuwamy `done` na dół
      sorted.sort((a, b) => {
        const aDone = a.status === "done" ? 1 : 0;
        const bDone = b.status === "done" ? 1 : 0;
        return aDone - bDone;
      });

      setTasks(sorted);
    } catch (error) {
      console.error("Błąd podczas pobierania zadań:", error);
    } finally {
      setLoading(false);
    }
  }, [userEmail, settings]);

  return { tasks, loading, fetchTasks };
}
