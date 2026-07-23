/**
 * App-level, non-secret config. Firebase itself is initialized natively from
 * google-services.json (Android) via @react-native-firebase — no JS SDK config object needed.
 */

export const AUTH_CONFIG = {
  countryCode: '+91',
  phoneDigits: 10,
  otpLength: 6,
  otpExpirySeconds: 60,
  maxOtpRequestsPerHour: 5,
} as const;

export const PROFILE_CONFIG = {
  nameMinLength: 2,
  nameMaxLength: 30,
} as const;
