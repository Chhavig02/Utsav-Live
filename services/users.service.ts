import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc } from '@react-native-firebase/firestore';

import type { User } from '@/types/user.types';
import { mapFirebaseError } from '@/utils/errors';

type ServiceResult<T> = { success: true; data: T } | { success: false; error: string };

const db = getFirestore(getApp());

/**
 * Waits for the `users/{uid}` doc to exist. Needed right after signup because the doc is
 * created asynchronously by the onCreate Auth trigger (Cloud Function), not by the client.
 */
export function waitForUserDoc(uid: string, timeoutMs = 15000): Promise<ServiceResult<User>> {
  return new Promise((resolve) => {
    let settled = false;
    let unsubscribe: () => void = () => {};

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      resolve({
        success: false,
        error: 'Setting up your account is taking longer than expected. Please try again.',
      });
    }, timeoutMs);

    unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        if (settled || !snapshot.exists()) return;
        settled = true;
        clearTimeout(timeout);
        unsubscribe();
        resolve({ success: true, data: { id: snapshot.id, ...(snapshot.data() as Omit<User, 'id'>) } });
      },
      (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        unsubscribe();
        resolve({ success: false, error: mapFirebaseError(error) });
      }
    );
  });
}

/** Updates editable profile fields. sl_id/role/counters are protected by security rules. */
export async function updateProfile(
  uid: string,
  fields: { name?: string; avatar_url?: string | null; cover_url?: string | null }
): Promise<ServiceResult<null>> {
  try {
    await updateDoc(doc(db, 'users', uid), fields);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error) };
  }
}
