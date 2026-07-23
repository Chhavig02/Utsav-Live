import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  prefix?: ReactNode;
  maxLength?: number;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
}

export function Input({
  value,
  onChangeText,
  label,
  error,
  prefix,
  maxLength,
  placeholder,
  keyboardType,
  autoFocus,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.status.error : focused ? colors.accent.flat : colors.divider;

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, { borderColor }]}>
        {prefix ? <View style={styles.prefix}>{prefix}</View> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          accessibilityLabel={label ?? placeholder}
        />
      </View>
      <View style={styles.footerRow}>
        {error ? <Text style={styles.error}>{error}</Text> : <View />}
        {maxLength ? (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  prefix: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  error: {
    fontSize: typography.caption.fontSize,
    color: colors.status.error,
  },
  counter: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginLeft: 'auto',
  },
});
