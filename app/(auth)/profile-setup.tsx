import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { updateProfile } from '@/services/users.service';
import { uploadProfileImage } from '@/services/storage.service';
import { displayNameSchema } from '@/utils/validation';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileSetup() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);

  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const nameValidation = displayNameSchema.safeParse(name);
  const isValid = nameValidation.success;

  async function pickImage(kind: 'avatar' | 'cover') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library access is needed to choose a picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: kind === 'avatar' ? [1, 1] : [3, 1],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setError('Please choose an image under 5MB.');
      return;
    }

    if (kind === 'avatar') setAvatarUri(asset.uri);
    else setCoverUri(asset.uri);
  }

  async function handleContinue() {
    if (!uid || !isValid) return;
    setError(null);
    setSaving(true);

    let avatar_url: string | null | undefined;
    let cover_url: string | null | undefined;

    if (avatarUri) {
      const uploaded = await uploadProfileImage(uid, avatarUri, 'avatar');
      if (!uploaded.success) {
        setSaving(false);
        setError(uploaded.error);
        return;
      }
      avatar_url = uploaded.data;
    }

    if (coverUri) {
      const uploaded = await uploadProfileImage(uid, coverUri, 'cover');
      if (!uploaded.success) {
        setSaving(false);
        setError(uploaded.error);
        return;
      }
      cover_url = uploaded.data;
    }

    const result = await updateProfile(uid, { name: nameValidation.data, avatar_url, cover_url });
    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>This is how other people on Utsav will see you.</Text>

        <Pressable onPress={() => pickImage('cover')} style={styles.coverWrapper}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Camera color={colors.text.secondary} size={24} />
              <Text style={styles.coverLabel}>Add cover photo</Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={() => pickImage('avatar')} style={styles.avatarWrapper}>
          <Avatar uri={avatarUri} size={88} ring="accent" />
          <View style={styles.avatarBadge}>
            <Camera color={colors.white} size={16} />
          </View>
        </Pressable>

        <View style={styles.field}>
          <Input
            label="Display name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            maxLength={30}
            error={name.length > 0 && !isValid ? nameValidation.error?.issues[0]?.message : undefined}
          />
        </View>

        {error ? <Text style={styles.submitError}>{error}</Text> : null}

        <Button variant="primary" label="Continue" onPress={handleContinue} disabled={!isValid} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginTop: -spacing.md,
  },
  coverWrapper: {
    height: 120,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.background.cardAlt,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  coverLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -spacing.xxl,
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.flat,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  field: {
    marginTop: spacing.md,
  },
  submitError: {
    fontSize: typography.caption.fontSize,
    color: colors.status.error,
  },
});
