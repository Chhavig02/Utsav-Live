import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

export default function Events() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Events</Text>
      <Text style={styles.subtitle}>Events are coming soon.</Text>
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
