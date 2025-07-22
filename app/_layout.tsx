import Header from "@/components/Header";
import BottomNavbarMobile from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView
} from "react-native-safe-area-context";
import LoginScreen from "./login";

// Wrapper to apply correct safe area handling
function AppContainer({ children }: { children: React.ReactNode }) {

  return (
    <SafeAreaView style={[styles.container]}>
      {children}
    </SafeAreaView>
  );
}

export default function RootLayout() {
 const { user } = useAuth();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppContainer>
          <Header />
            {!user ? <Slot /> : <LoginScreen/>}
            <View style={{ height: 64 }} />
          <BottomNavbarMobile />
        </AppContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 0
  },
});
