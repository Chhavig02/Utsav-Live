import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Headphones, Home, User, Video } from 'lucide-react-native';

import { colors, spacing, typography } from '@/constants/theme';

type TabKey = 'home' | 'audio' | 'events' | 'profile';

const TABS: { key: TabKey; label: string; icon: typeof Home; href: `/(tabs)/${TabKey}` }[] = [
  { key: 'home', label: 'Home', icon: Home, href: '/(tabs)/home' },
  { key: 'audio', label: 'Audio', icon: Headphones, href: '/(tabs)/audio' },
  { key: 'events', label: 'Events', icon: Calendar, href: '/(tabs)/events' },
  { key: 'profile', label: 'Profile', icon: User, href: '/(tabs)/profile' },
];

/** "Go Live" is a raised center action button, not a real tab route — it opens the
 * role-gated go-live flow rather than switching tabs. */
export function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const activeTab = (segments[segments.length - 1] ?? 'home') as TabKey;

  const leftTabs = TABS.slice(0, 2);
  const rightTabs = TABS.slice(2);

  return (
    <View style={styles.container}>
      {leftTabs.map((tab) => (
        <NavItem key={tab.key} tab={tab} active={activeTab === tab.key} onPress={() => router.push(tab.href)} />
      ))}

      <Pressable
        style={styles.goLiveButton}
        onPress={() => router.push('/live/go-live-gate')}
        accessibilityRole="button"
        accessibilityLabel="Go Live"
      >
        <LinearGradient colors={colors.accent.gradient} style={styles.goLiveGradient}>
          <Video color={colors.white} size={26} />
        </LinearGradient>
      </Pressable>

      {rightTabs.map((tab) => (
        <NavItem key={tab.key} tab={tab} active={activeTab === tab.key} onPress={() => router.push(tab.href)} />
      ))}
    </View>
  );
}

function NavItem({
  tab,
  active,
  onPress,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onPress: () => void;
}) {
  const Icon = tab.icon;
  const color = active ? colors.accent.flat : colors.text.secondary;

  return (
    <Pressable style={styles.item} onPress={onPress} accessibilityRole="tab" accessibilityLabel={tab.label}>
      <Icon color={color} size={22} />
      <Text style={[styles.label, { color }]}>{tab.label}</Text>
    </Pressable>
  );
}

const NAV_HEIGHT = 64;
const GO_LIVE_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NAV_HEIGHT,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 44,
  },
  label: {
    fontSize: typography.caption.fontSize,
  },
  goLiveButton: {
    width: GO_LIVE_SIZE,
    height: GO_LIVE_SIZE,
    borderRadius: GO_LIVE_SIZE / 2,
    marginTop: -GO_LIVE_SIZE / 3,
    marginHorizontal: spacing.sm,
    shadowColor: colors.accent.flat,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  goLiveGradient: {
    width: '100%',
    height: '100%',
    borderRadius: GO_LIVE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
