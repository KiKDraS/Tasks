import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";
import { generateId } from "@/utils/id";

const PHOTOS_DIRECTORY = "task-photos";
const DEFAULT_EXTENSION = ".jpg";

const PHOTO_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.6,
};

async function copyToDocuments(uri: string): Promise<string> {
  const directory = new Directory(Paths.document, PHOTOS_DIRECTORY);
  directory.create({ idempotent: true, intermediates: true });

  const source = new File(uri);
  const extension = source.extension || DEFAULT_EXTENSION;
  const destination = new File(directory, `${generateId()}${extension}`);

  await source.copy(destination);

  return destination.uri;
}

async function savePhoto(
  result: ImagePicker.ImagePickerResult,
): Promise<DeviceResult<{ uri: string }>> {
  const asset = result.assets?.[0];
  if (result.canceled || !asset) {
    return { status: "cancelled" };
  }

  const uri = await copyToDocuments(asset.uri);

  return { status: "granted", value: { uri } };
}

function deniedResult(permission: {
  canAskAgain: boolean;
}): DeviceResult<{ uri: string }> {
  return { status: "denied", canAskAgain: permission.canAskAgain };
}

export async function takePhoto(): Promise<DeviceResult<{ uri: string }>> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return deniedResult(permission);
    }

    const result = await ImagePicker.launchCameraAsync(PHOTO_OPTIONS);

    return await savePhoto(result);
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.mediaError };
  }
}

export async function pickPhoto(): Promise<DeviceResult<{ uri: string }>> {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return deniedResult(permission);
    }

    const result = await ImagePicker.launchImageLibraryAsync(PHOTO_OPTIONS);

    return await savePhoto(result);
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.mediaError };
  }
}

export function deletePhoto(uri: string): void {
  try {
    new File(uri).delete();
  } catch {
    // Best effort: the file may already be gone.
  }
}
