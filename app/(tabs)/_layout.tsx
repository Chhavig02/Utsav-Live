import { View } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/ui/BottomNav';
import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Slot />
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background.card }}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}
