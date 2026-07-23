import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

const SPLASH_ARTWORK = require('../../assets/splash-hero.png');
const MIN_DISPLAY_MS = 900;

export default function Splash() {
  const initializing = useAuthStore((s) => s.initializing);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const userDoc = useAuthStore((s) => s.userDoc);
  const minDelayElapsed = useRef(false);

  const navigateIfReady = useCallback(() => {
    if (initializing || !minDelayElapsed.current) return;

    if (!firebaseUser) {
      router.replace('/(auth)/login');
      return;
    }

    if (!userDoc || !userDoc.name) {
      router.replace('/(auth)/profile-setup');
      return;
    }

    router.replace('/(tabs)/home');
  }, [initializing, firebaseUser, userDoc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      minDelayElapsed.current = true;
      navigateIfReady();
    }, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [navigateIfReady]);

  useEffect(() => {
    navigateIfReady();
  }, [navigateIfReady]);

  return (
    <ImageBackground source={SPLASH_ARTWORK} style={styles.container} resizeMode="cover">
      <View style={styles.footer}>
        <ActivityIndicator color={colors.accent.gold} />
        <Text style={styles.loadingLabel}>LOADING…</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 48,
    gap: 12,
  },
  loadingLabel: {
    color: colors.accent.gold,
    fontSize: 12,
    letterSpacing: 2,
  },
});
