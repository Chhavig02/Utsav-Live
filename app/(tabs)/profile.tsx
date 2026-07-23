import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';
import { signOut } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

export default function Profile() {
  const userDoc = useAuthStore((s) => s.userDoc);

  return (
    <View style={styles.screen}>
      <Avatar uri={userDoc?.avatar_url ?? null} size={88} />
      <Text style={styles.name}>{userDoc?.name ?? '—'}</Text>
      <Text style={styles.slId}>{userDoc?.sl_id ?? ''}</Text>
      <Text style={styles.subtitle}>The full profile experience is coming soon.</Text>
      <Button variant="secondary" label="Sign out" onPress={() => signOut().then(() => router.replace('/(auth)/login'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.sectionHeader.fontSize,
    fontWeight: typography.sectionHeader.fontWeight,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  slId: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
