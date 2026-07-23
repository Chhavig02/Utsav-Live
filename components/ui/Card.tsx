import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing } from '@/constants/theme';

interface CardProps extends PropsWithChildren {
  padding?: number;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ padding = spacing.lg, onPress, children }: CardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the documented API
    scale.value = withTiming(0.98, { duration: 120 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the documented API
    scale.value = withTiming(1, { duration: 120 });
  }, [scale]);

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { padding }, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[styles.card, { padding }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.card,
  },
});
