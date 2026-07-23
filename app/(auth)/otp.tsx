import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { AUTH_CONFIG } from '@/constants/config';
import { confirmOtp, sendOtp } from '@/services/auth.service';
import { waitForUserDoc } from '@/services/users.service';
import { otpSchema } from '@/utils/validation';
import { useOtpStore } from '@/stores/otpStore';

export default function Otp() {
  const nationalNumber = useOtpStore((s) => s.nationalNumber);
  const confirmation = useOtpStore((s) => s.confirmation);
  const setPending = useOtpStore((s) => s.setPending);
  const clearPending = useOtpStore((s) => s.clear);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(AUTH_CONFIG.otpExpirySeconds);

  useEffect(() => {
    if (!confirmation) {
      router.replace('/(auth)/login');
    }
  }, [confirmation]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const codeValidation = otpSchema.safeParse(code);
  const isValid = codeValidation.success;

  async function handleVerify() {
    if (!confirmation || !isValid) return;
    setError(null);
    setVerifying(true);

    const result = await confirmOtp(confirmation, code);
    if (!result.success) {
      setVerifying(false);
      setError(result.error);
      return;
    }

    const uid = result.data.credential.user.uid;
    const userDocResult = await waitForUserDoc(uid);
    setVerifying(false);
    clearPending();

    if (!userDocResult.success) {
      setError(userDocResult.error);
      return;
    }

    if (!userDocResult.data.name) {
      router.replace('/(auth)/profile-setup');
    } else {
      router.replace('/(tabs)/home');
    }
  }

  async function handleResend() {
    if (secondsLeft > 0 || resending) return;
    setError(null);
    setResending(true);
    const result = await sendOtp(nationalNumber);
    setResending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setPending(nationalNumber, result.data);
    setCode('');
    setSecondsLeft(AUTH_CONFIG.otpExpirySeconds);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the {AUTH_CONFIG.otpLength}-digit code sent to {AUTH_CONFIG.countryCode} {nationalNumber}
        </Text>

        <Input
          label="OTP"
          value={code}
          onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={AUTH_CONFIG.otpLength}
          placeholder="6-digit code"
          error={error ?? undefined}
          autoFocus
        />

        <Button variant="primary" label="Verify" onPress={handleVerify} disabled={!isValid} loading={verifying} />

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Text style={styles.resendTimer}>Resend code in {secondsLeft}s</Text>
          ) : (
            <Button variant="text" label="Resend OTP" onPress={handleResend} loading={resending} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginTop: -spacing.md,
  },
  resendRow: {
    alignItems: 'center',
  },
  resendTimer: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
});
