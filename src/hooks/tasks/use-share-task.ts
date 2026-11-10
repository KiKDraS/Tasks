import { PERMISSION_NOTICE_COPY } from "@/components/ui/permissions/constants";
import type { Task } from "@/context/tasks/types/Task";
import { pickContact, type ContactSummary } from "@/services/contacts";
import { openAppSettings, type DeviceResult } from "@/services/permissions";
import { shareTask } from "@/utils/share-task";
import { useCallback } from "react";
import { Alert } from "react-native";

const SHARE_ALERTS = {
  menuTitle: "Compartir tarea",
  contactTitle: "Compartir con contacto",
  share: "Compartir",
  shareWithContact: "Compartir con contacto",
  cancel: "Cancelar",
  dismiss: "Entendido",
  failureTitle: "No se pudo compartir",
  failureMessage: "Intentá de nuevo.",
} as const;

type ContactFailure = Exclude<
  DeviceResult<ContactSummary>,
  { status: "granted" }
>;

function showContactPermissionAlert(canAskAgain: boolean): void {
  if (canAskAgain) {
    Alert.alert(SHARE_ALERTS.contactTitle, PERMISSION_NOTICE_COPY.denied, [
      { text: SHARE_ALERTS.dismiss },
    ]);
    return;
  }

  Alert.alert(SHARE_ALERTS.contactTitle, PERMISSION_NOTICE_COPY.blocked, [
    { text: SHARE_ALERTS.cancel, style: "cancel" },
    {
      text: PERMISSION_NOTICE_COPY.openSettings,
      onPress: () => {
        void openAppSettings();
      },
    },
  ]);
}

function showContactFailure(result: ContactFailure): void {
  if (result.status === "cancelled") {
    return;
  }

  if (result.status === "denied") {
    showContactPermissionAlert(result.canAskAgain);
    return;
  }

  Alert.alert(SHARE_ALERTS.failureTitle, result.message, [
    { text: SHARE_ALERTS.dismiss },
  ]);
}

function showShareFailure(): void {
  Alert.alert(SHARE_ALERTS.failureTitle, SHARE_ALERTS.failureMessage, [
    { text: SHARE_ALERTS.dismiss },
  ]);
}

export interface ShareTaskActions {
  share: () => Promise<void>;
  shareWithContact: () => Promise<void>;
  openShareMenu: () => void;
}

export function useShareTask(task?: Task): ShareTaskActions {
  const share = useCallback(async (): Promise<void> => {
    if (!task) {
      return;
    }

    try {
      await shareTask(task);
    } catch {
      showShareFailure();
    }
  }, [task]);

  const shareWithContact = useCallback(async (): Promise<void> => {
    if (!task) {
      return;
    }

    const result = await pickContact();
    if (result.status !== "granted") {
      showContactFailure(result);
      return;
    }

    try {
      await shareTask(task, {
        title: result.value.name,
        recipientName: result.value.name,
      });
    } catch {
      showShareFailure();
    }
  }, [task]);

  const openShareMenu = useCallback(() => {
    Alert.alert(SHARE_ALERTS.menuTitle, undefined, [
      {
        text: SHARE_ALERTS.share,
        onPress: () => {
          void share();
        },
      },
      {
        text: SHARE_ALERTS.shareWithContact,
        onPress: () => {
          void shareWithContact();
        },
      },
      { text: SHARE_ALERTS.cancel, style: "cancel" },
    ]);
  }, [share, shareWithContact]);

  return { share, shareWithContact, openShareMenu };
}
