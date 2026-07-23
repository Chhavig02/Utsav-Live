import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, minTapTarget, radius, spacing, typography } from '@/constants/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text' | 'destructive';
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'default' | 'small';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  variant = 'primary',
  label,
  onPress,
  disabled = false,
  loading = false,
  size = 'default',
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isInteractive = !disabled && !loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!isInteractive) return;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the documented API
    scale.value = withTiming(0.97, { duration: 150 });
  }, [isInteractive, scale]);

  const handlePressOut = useCallback(() => {
    if (!isInteractive) return;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the documented API
    scale.value = withTiming(1, { duration: 150 });
  }, [isInteractive, scale]);

  const height = size === 'small' ? 36 : minTapTarget;
  const textColor = variant === 'primary' || variant === 'destructive' ? colors.white : colors.accent.flat;

  const content = loading ? (
    <ActivityIndicator color={textColor} />
  ) : (
    <Text
      style={[
        styles.label,
        { color: disabled ? colors.text.secondary : textColor },
      ]}
      numberOfLines={1}
    >
      {label}
    </Text>
  );

  const containerStyle = [
    styles.base,
    { height, opacity: disabled ? 0.4 : 1 },
    variant === 'secondary' && styles.secondary,
    variant === 'text' && styles.text,
    variant === 'destructive' && styles.destructive,
  ];

  if (variant === 'primary' && !disabled) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isInteractive}
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, { height }]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!isInteractive}
      style={[containerStyle, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.contentRow}>{content}</View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.buttonPill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.flat,
  },
  text: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.status.error,
  },
  label: {
    fontSize: typography.buttonLabel.fontSize,
    fontWeight: typography.buttonLabel.fontWeight,
  },
});
