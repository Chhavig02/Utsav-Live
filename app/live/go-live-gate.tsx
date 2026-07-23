import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';

export default function GoLiveGate() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Go Live</Text>
      <Text style={styles.subtitle}>Video live streaming is coming soon.</Text>
      <Button variant="secondary" label="Back" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
