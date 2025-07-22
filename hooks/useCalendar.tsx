import { databases } from '@/utils/appwrite';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import type { HabitRow } from '../types';

const DATABASE_ID = "calendar";

export function useCalendarData(
  userEmail: string,
  rangeStart: string,
  rangeEnd: string
) {
  const [tasksCount, setTasksCount] = useState<Record<string, number>>({});
  const [habitCounts, setHabitCounts] = useState<Record<string, number>>({});
  const [waterCounts, setWaterCounts] = useState<Record<string, number>>({});
  const [moneyCounts, setMoneyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [tRes, hRes, wRes, mRes] = await Promise.all([
          databases.listDocuments(DATABASE_ID, 'tasks', [
            Query.equal('user_name', userEmail),
            Query.greaterThanEqual('due_date', rangeStart),
            Query.lessThanEqual('due_date', rangeEnd),
          ]),
          databases.listDocuments(DATABASE_ID, 'daily_habits', [
            Query.equal('user_name', userEmail),
            Query.greaterThanEqual('date', rangeStart),
            Query.lessThanEqual('date', rangeEnd),
          ]),
          databases.listDocuments(DATABASE_ID, 'water', [
            Query.equal('user_name', userEmail),
            Query.greaterThanEqual('date', rangeStart),
            Query.lessThanEqual('date', rangeEnd),
          ]),
          databases.listDocuments(DATABASE_ID, 'daily_habits', [
            Query.equal('user_name', userEmail),
            Query.greaterThanEqual('date', rangeStart),
            Query.lessThanEqual('date', rangeEnd),
          ]),
        ]);

        const tMap: Record<string, number> = {};
        tRes.documents.forEach(({ due_date }) => {
          tMap[due_date] = (tMap[due_date] || 0) + 1;
        });
        setTasksCount(tMap);

        const hMap: Record<string, number> = {};
        hRes.documents.forEach((doc) => {
  const h: HabitRow = {
    date: doc.date,
    pills: doc.pills ?? 0,
    bath: doc.bath ?? 0,
    workout: doc.workout ?? 0,
    friends: doc.friends ?? 0,
    work: doc.work ?? 0,
    housework: doc.housework ?? 0,
    plants: doc.plants ?? 0,
    duolingo: doc.duolingo ?? 0,
  };

  const sum =
    +h.pills +
    +h.bath +
    +h.workout +
    +h.friends +
    +h.work +
    +h.housework +
    +h.plants +
    +h.duolingo;

  hMap[h.date] = sum;
});
        setHabitCounts(hMap);

        const wMap: Record<string, number> = {};
wRes.documents.forEach((doc) => {
  const date = doc.date;
  const amount = doc.amount ?? 0;
  wMap[date] = (wMap[date] || 0) + amount;
});
setWaterCounts(wMap);

const mMap: Record<string, number> = {};
mRes.documents.forEach((doc) => {
  const date = doc.date;
  const spending = doc.daily_spending ?? 0;
  mMap[date] = (mMap[date] || 0) + spending;
});
setMoneyCounts(mMap);

      } catch (err) {
        console.error('Błąd podczas pobierania danych kalendarza:', err);
      }
    }

    fetchData();
  }, [userEmail, rangeStart, rangeEnd]);

  return { tasksCount, habitCounts, waterCounts, moneyCounts };
}
