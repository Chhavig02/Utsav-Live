import { z } from 'zod';

import { AUTH_CONFIG, PROFILE_CONFIG } from '@/constants/config';

export const phoneNumberSchema = z
  .string()
  .length(AUTH_CONFIG.phoneDigits, `Enter a valid ${AUTH_CONFIG.phoneDigits}-digit mobile number`)
  .regex(/^\d+$/, 'Mobile number must contain digits only');

export const otpSchema = z
  .string()
  .length(AUTH_CONFIG.otpLength, `Enter the ${AUTH_CONFIG.otpLength}-digit code`)
  .regex(/^\d+$/, 'Code must contain digits only');

export const displayNameSchema = z
  .string()
  .trim()
  .min(PROFILE_CONFIG.nameMinLength, `Name must be at least ${PROFILE_CONFIG.nameMinLength} characters`)
  .max(PROFILE_CONFIG.nameMaxLength, `Name must be at most ${PROFILE_CONFIG.nameMaxLength} characters`);
