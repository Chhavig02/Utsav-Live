import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type UserRole = 'viewer' | 'host' | 'agency_owner' | 'moderator' | 'admin' | 'support';

export interface User {
  id: string;
  sl_id: string;
  name: string;
  phone: string;
  avatar_url: string | null;
  cover_url: string | null;
  role: UserRole;
  followers_count: number;
  following_count: number;
  created_at: FirebaseFirestoreTypes.Timestamp;
}
