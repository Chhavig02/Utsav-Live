import { create } from 'zustand';
import type { ConfirmationResult } from '@react-native-firebase/auth';

/** Ephemeral state for the in-progress Login → OTP verification flow. */
interface OtpState {
  nationalNumber: string;
  confirmation: ConfirmationResult | null;
  setPending: (nationalNumber: string, confirmation: ConfirmationResult) => void;
  clear: () => void;
}

export const useOtpStore = create<OtpState>((set) => ({
  nationalNumber: '',
  confirmation: null,
  setPending: (nationalNumber, confirmation) => set({ nationalNumber, confirmation }),
  clear: () => set({ nationalNumber: '', confirmation: null }),
}));
