/**
 * Maps Firebase error codes to user-friendly messages so UI components
 * never have to handle raw Firebase error codes directly.
 */
export function mapFirebaseError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'That phone number doesn’t look right. Please check and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a while before trying again.';
    case 'auth/quota-exceeded':
      return 'We’re unable to send an OTP right now. Please try again later.';
    case 'auth/invalid-verification-code':
      return 'Incorrect code. Please check and try again.';
    case 'auth/code-expired':
      return 'This code has expired. Please request a new one.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
