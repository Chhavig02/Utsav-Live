import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { AUTH_CONFIG } from '@/constants/config';
import { sendOtp } from '@/services/auth.service';
import { phoneNumberSchema } from '@/utils/validation';
import { useOtpStore } from '@/stores/otpStore';

const formSchema = z.object({ phone: phoneNumberSchema });
type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const setPending = useOtpStore((s) => s.setPending);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { phone: '' },
  });

  async function onSubmit({ phone }: FormValues) {
    setSubmitError(null);
    const result = await sendOtp(phone);
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    setPending(phone, result.data);
    router.push('/(auth)/otp');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Log in to Utsav</Text>
          <Text style={styles.subtitle}>We’ll send you a one-time code to verify your number.</Text>

          <View style={styles.field}>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Mobile number"
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  prefix={<Text style={styles.prefix}>{AUTH_CONFIG.countryCode}</Text>}
                  keyboardType="number-pad"
                  maxLength={AUTH_CONFIG.phoneDigits}
                  placeholder="10-digit mobile number"
                  error={errors.phone?.message}
                  autoFocus
                />
              )}
            />
          </View>

          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

          <Button
            variant="primary"
            label="Send OTP"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
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
  field: {
    marginTop: spacing.md,
  },
  prefix: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    fontWeight: '600',
  },
  submitError: {
    fontSize: typography.caption.fontSize,
    color: colors.status.error,
  },
});
