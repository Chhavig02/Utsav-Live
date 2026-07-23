import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Radio } from 'lucide-react-native';

import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const userDoc = useAuthStore((s) => s.userDoc);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Utsav</Text>
        <Avatar uri={userDoc?.avatar_url ?? null} size={36} />
      </View>

      <Text style={styles.sectionHeader}>Top Live Now</Text>

      <EmptyState
        icon={<Radio color={colors.text.secondary} size={32} />}
        title="No one is live right now"
        subtitle="Check back soon, or follow hosts to get notified when they go live."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.text.primary,
  },
  sectionHeader: {
    fontSize: typography.sectionHeader.fontSize,
    fontWeight: typography.sectionHeader.fontWeight,
    color: colors.text.primary,
  },
});
