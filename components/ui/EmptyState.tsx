import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button variant="secondary" label={actionLabel} onPress={onAction} size="small" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sectionHeader.fontSize,
    fontWeight: typography.sectionHeader.fontWeight,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.sm,
  },
});
