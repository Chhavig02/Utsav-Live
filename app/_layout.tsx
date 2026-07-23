import '../global.css';

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';

import { subscribeToAuthState } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user.types';

const db = getFirestore(getApp());

export default function RootLayout() {
  const setFirebaseUser = useAuthStore((s) => s.setFirebaseUser);
  const setUserDoc = useAuthStore((s) => s.setUserDoc);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      setFirebaseUser(firebaseUser);
      unsubscribeUserDoc?.();
      unsubscribeUserDoc = null;

      if (!firebaseUser) {
        setUserDoc(null);
        setInitializing(false);
        return;
      }

      unsubscribeUserDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (snapshot) => {
        setUserDoc(snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as Omit<User, 'id'>) }) : null);
        setInitializing(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc?.();
    };
  }, [setFirebaseUser, setUserDoc, setInitializing]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
