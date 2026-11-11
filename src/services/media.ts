import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";
import { generateId } from "@/utils/id";

const PHOTOS_DIRECTORY = "task-photos";
const DEFAULT_EXTENSION = ".jpg";

const CAMERA_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.6,
};

const GALLERY_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsMultipleSelection: true,
  orderedSelection: true,
  selectionLimit: 0,
  allowsEditing: false,
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

async function savePhotos(
  result: ImagePicker.ImagePickerResult,
): Promise<DeviceResult<{ uris: string[] }>> {
  const assets = result.assets ?? [];
  if (result.canceled || assets.length === 0) {
    return { status: "cancelled" };
  }

  const outcomes = await Promise.allSettled(
    assets.map((asset) => copyToDocuments(asset.uri)),
  );
  const savedUris = outcomes.flatMap((outcome) =>
    outcome.status === "fulfilled" ? [outcome.value] : [],
  );
  const hasFailure = outcomes.some((outcome) => outcome.status === "rejected");

  if (hasFailure) {
    savedUris.forEach(deletePhoto);
    throw new Error("Failed to copy photos");
  }

  return { status: "granted", value: { uris: savedUris } };
}

async function savePhoto(
  result: ImagePicker.ImagePickerResult,
): Promise<DeviceResult<{ uri: string }>> {
  const saved = await savePhotos(result);
  if (saved.status !== "granted") {
    return saved;
  }

  return { status: "granted", value: { uri: saved.value.uris[0] } };
}

function deniedResult<T>(permission: {
  canAskAgain: boolean;
}): DeviceResult<T> {
  return { status: "denied", canAskAgain: permission.canAskAgain };
}

export async function takePhoto(): Promise<DeviceResult<{ uri: string }>> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return deniedResult(permission);
    }

    const result = await ImagePicker.launchCameraAsync(CAMERA_OPTIONS);

    return await savePhoto(result);
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.mediaError };
  }
}

export async function pickPhotos(): Promise<DeviceResult<{ uris: string[] }>> {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return deniedResult(permission);
    }

    const result = await ImagePicker.launchImageLibraryAsync(GALLERY_OPTIONS);

    return await savePhotos(result);
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
