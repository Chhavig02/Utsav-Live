import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type User,
  type UserCredential,
} from '@react-native-firebase/auth';

import { AUTH_CONFIG } from '@/constants/config';
import { mapFirebaseError } from '@/utils/errors';

type ServiceResult<T> = { success: true; data: T } | { success: false; error: string };

const auth = getAuth(getApp());

/** Sends a 6-digit OTP to a 10-digit national number via Firebase Phone Auth. */
export async function sendOtp(
  nationalNumber: string
): Promise<ServiceResult<ConfirmationResult>> {
  try {
    const fullNumber = `${AUTH_CONFIG.countryCode}${nationalNumber}`;
    const confirmation = await signInWithPhoneNumber(auth, fullNumber);
    return { success: true, data: confirmation };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error) };
  }
}

/** Verifies the OTP and signs the user in. */
export async function confirmOtp(
  confirmation: ConfirmationResult,
  code: string
): Promise<ServiceResult<{ credential: UserCredential; isNewUser: boolean }>> {
  try {
    const credential = await confirmation.confirm(code);
    if (!credential) {
      return { success: false, error: 'Verification failed. Please try again.' };
    }
    const isNewUser = credential.additionalUserInfo?.isNewUser ?? false;
    return { success: true, data: { credential, isNewUser } };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error) };
  }
}

export async function signOut(): Promise<ServiceResult<null>> {
  try {
    await firebaseSignOut(auth);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error) };
  }
}

export function getCurrentFirebaseUser() {
  return auth.currentUser;
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
