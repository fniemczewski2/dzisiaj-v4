import { Link, usePathname } from "expo-router";
import {
  Calendar,
  Coins,
  ListTodo,
  Pen,
  Settings,
} from "lucide-react-native"; // Uwaga: użyj lucide-react-native zamiast lucide-react
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppRoute = "/tasks" | "/notes" | "/bills" | "/calendar" | "/settings";

type NavItem = {
  href: AppRoute;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
};

const links: NavItem[] = [
  { href: "/tasks", icon: ListTodo, label: "Zadania" },
  { href: "/notes", icon: Pen, label: "Notatki" },
  { href: "/bills", icon: Coins, label: "Rachunki" },
  { href: "/calendar", icon: Calendar, label: "Kalendarz" },
  { href: "/settings", icon: Settings, label: "Ustawienia" },
];

export default function BottomNavbarMobile() {
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      {links.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        const color = isActive ? "#2563eb" : "#6b7280";

        return (
          <Link key={href} href={href} asChild>
            <TouchableOpacity style={styles.navItem}>
              <Icon size={24} color={color} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 28,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
