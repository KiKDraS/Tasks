import * as Location from "expo-location";

import type { TaskLocation } from "@/context/tasks/types/Task";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";

function formatAddress(
  address: Location.LocationGeocodedAddress,
): string | undefined {
  const parts = [
    address.name,
    address.street,
    address.streetNumber,
    address.city,
    address.region,
    address.country,
  ].filter((part): part is string => !!part);

  const formatted = parts.join(", ");

  return formatted || undefined;
}

async function reverseGeocode(coords: {
  latitude: number;
  longitude: number;
}): Promise<string | undefined> {
  try {
    const [address] = await Location.reverseGeocodeAsync(coords);

    return address ? formatAddress(address) : undefined;
  } catch {
    return undefined;
  }
}

export async function getCurrentLocation(): Promise<
  DeviceResult<TaskLocation>
> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return { status: "denied", canAskAgain: permission.canAskAgain };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = position.coords;
    const address = await reverseGeocode({ latitude, longitude });

    return {
      status: "granted",
      value: { latitude, longitude, address },
    };
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.locationError };
  }
}
