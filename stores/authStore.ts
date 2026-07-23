import { create } from 'zustand';
import type { User as FirebaseUser } from '@react-native-firebase/auth';

import type { User } from '@/types/user.types';

interface AuthState {
  /** The current Firebase Auth session. */
  firebaseUser: FirebaseUser | null;
  /**
   * The signed-in user's own `users/{uid}` Firestore document, kept live so routing
   * decisions (e.g. on the Splash screen) always reflect the current profile state.
   */
  userDoc: User | null;
  initializing: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserDoc: (userDoc: User | null) => void;
  setInitializing: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userDoc: null,
  initializing: true,
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setUserDoc: (userDoc) => set({ userDoc }),
  setInitializing: (initializing) => set({ initializing }),
  reset: () => set({ firebaseUser: null, userDoc: null }),
}));
