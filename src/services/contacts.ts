import * as Contacts from "expo-contacts/legacy";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";

export interface ContactSummary {
  name: string;
}

export async function pickContact(): Promise<DeviceResult<ContactSummary>> {
  try {
    const permission = await Contacts.requestPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return { status: "denied", canAskAgain: permission.canAskAgain };
    }

    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) {
      return { status: "cancelled" };
    }

    return {
      status: "granted",
      value: { name: contact.name },
    };
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.contactsError };
  }
}
