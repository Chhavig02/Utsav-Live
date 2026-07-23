import { getApp } from '@react-native-firebase/app';
import { getStorage, ref, putFile, getDownloadURL } from '@react-native-firebase/storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { mapFirebaseError } from '@/utils/errors';

type ServiceResult<T> = { success: true; data: T } | { success: false; error: string };

const storage = getStorage(getApp());
const MAX_LONGEST_EDGE = 1080;

/**
 * Compresses an image (resize + JPEG re-encode) before uploading it to
 * `profile_images/{uid}/{kind}.jpg`. Write access is restricted to the owning user.
 */
export async function uploadProfileImage(
  uid: string,
  localUri: string,
  kind: 'avatar' | 'cover'
): Promise<ServiceResult<string>> {
  try {
    const manipulated = await manipulateAsync(
      localUri,
      [{ resize: { width: MAX_LONGEST_EDGE } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );

    const path = `profile_images/${uid}/${kind}.jpg`;
    const storageRef = ref(storage, path);
    await putFile(storageRef, manipulated.uri);
    const downloadUrl = await getDownloadURL(storageRef);

    return { success: true, data: downloadUrl };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error) };
  }
}
