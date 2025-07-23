import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession(); // ważne dla poprawnego działania redirectów

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { login, loading } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    try {
      await login();          
    }
     catch (err) {
      console.error('Błąd logowania:', err);
    } 
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.infoText}>Zaloguj się, aby korzystać z aplikacji</Text>

        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            disabled={loading}
            onPress={handleLogin}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Zaloguj przez Google</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    maxWidth: 400,
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#ff3e03',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
