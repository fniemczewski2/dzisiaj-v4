import { Query } from 'appwrite';
import { useCallback, useEffect, useState } from 'react';
import { Bill } from '../types';
import { databases } from "../utils/appwrite";
import { useSettings } from './useSettings';

export function useBills(userEmail: string) {
  const { settings } = useSettings(userEmail);
  const [bills, setBills] = useState<Bill[]>([]);
  const [budgetItems, setBudgetItems] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const DATABASE_ID = "687be7da002f9935927c";

  const fetchBills = useCallback(async () => {
    if (!userEmail || !settings) return;
    setLoading(true);

    try {
      const billsRes = await databases.listDocuments(
        DATABASE_ID,
        'bills',
        [
          Query.equal('user_name', userEmail),
          Query.equal('include_in_budget', false),
          Query.orderAsc('date'),
        ]
      );
      setBills(
        billsRes.documents.map((doc) => ({
            $id: doc.$id,
            amount: doc.amount,
            description: doc.description,
            date: doc.date,
            user_name: doc.user_name,
            include_in_budget: doc.include_in_budget,
        })) as Bill[]
        );

      if (settings.show_budget_items) {
        const budgetRes = await databases.listDocuments(
          DATABASE_ID,
          'bills',
          [
            Query.equal('user_name', userEmail),
            Query.equal('include_in_budget', true),
            Query.orderAsc('date'),
          ]
        );
        setBudgetItems(
    budgetRes.documents.map((doc) => ({
      $id: doc.$id,
      amount: doc.amount,
      description: doc.description,
      date: doc.date,
      user_name: doc.user_name,
      include_in_budget: doc.include_in_budget,
    }))
  );
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
      setBills([]);
      setBudgetItems([]);
    }

    setLoading(false);
  }, [userEmail, settings]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, budgetItems, loading, fetchBills };
}
