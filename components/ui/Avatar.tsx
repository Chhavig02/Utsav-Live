import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { UserRound } from 'lucide-react-native';

import { colors } from '@/constants/theme';

interface AvatarProps {
  uri: string | null;
  size: number;
  ring?: 'none' | 'accent' | 'live';
}

export function Avatar({ uri, size, ring = 'none' }: AvatarProps) {
  const ringColor = ring === 'accent' ? colors.accent.gold : ring === 'live' ? colors.status.error : 'transparent';
  const ringWidth = ring === 'none' ? 0 : 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size + ringWidth * 2,
          height: size + ringWidth * 2,
          borderRadius: (size + ringWidth * 2) / 2,
          borderWidth: ringWidth,
          borderColor: ringColor,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          accessibilityLabel="Profile avatar"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <UserRound color={colors.text.secondary} size={size * 0.6} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    backgroundColor: colors.background.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
