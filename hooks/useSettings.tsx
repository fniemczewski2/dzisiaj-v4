import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { Settings } from '../types';
import { databases } from "../utils/appwrite";

const DATABASE_ID = "687be7da002f9935927c";
const COLLECTION_ID = 'settings';

export function useSettings(userEmail: string) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchSettings = async () => {
      try {
        const { documents } = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('user_name', userEmail)]
        );

        if (documents.length > 0) {
          const doc = documents[0];

          const safeSettings: Settings = {
            user_name: doc.user_name ?? userEmail,
            sort_order: doc.sort_order ?? 'priority',
            show_completed: doc.show_completed ?? true,
            show_habits: doc.show_habits ?? true,
            show_water_tracker: doc.show_water_tracker ?? true,
            show_budget_items: doc.show_budget_items ?? false,
            users: doc.users ?? [],
          };

          setSettings(safeSettings);
        } else {
          // Domyślne ustawienia
          const defaults: Settings = {
            user_name: userEmail,
            sort_order: 'priority',
            show_completed: true,
            show_habits: true,
            show_water_tracker: true,
            show_budget_items: false,
            users: [],
          };

          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            'unique()',
            defaults
          );

          setSettings(defaults);
        }
      } catch (error) {
        console.error('Błąd pobierania ustawień:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userEmail]);

  return { settings, loading };
}
