import * as Contacts from "expo-contacts/legacy";

import type { TaskContact } from "@/context/tasks/types/Task";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";

export async function pickContact(): Promise<DeviceResult<TaskContact>> {
  try {
    const permission = await Contacts.requestPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return { status: "denied", canAskAgain: permission.canAskAgain };
    }

    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) {
      return { status: "cancelled" };
    }

    const phoneNumber = contact.phoneNumbers?.[0]?.number;

    return {
      status: "granted",
      value: {
        id: contact.id,
        name: contact.name,
        ...(phoneNumber ? { phoneNumber } : {}),
      },
    };
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.contactsError };
  }
}
