import type { TaskShare } from "@/context/tasks/types/Task";
import { formatTime, MONTHS } from "@/utils/date";

const SHARE_TARGET_LABELS: Record<string, string> = {
  "com.apple.UIKit.activity.Mail": "Mail",
  "com.apple.UIKit.activity.Message": "Mensajes",
  "com.apple.UIKit.activity.CopyToPasteboard": "Copiar",
  "com.apple.UIKit.activity.PostToFacebook": "Facebook",
  "com.apple.UIKit.activity.PostToTwitter": "Twitter",
  "com.apple.UIKit.activity.PostToWeibo": "Weibo",
  "com.apple.UIKit.activity.PostToTencentWeibo": "Tencent Weibo",
  "com.apple.UIKit.activity.PostToFlickr": "Flickr",
  "com.apple.UIKit.activity.PostToVimeo": "Vimeo",
  "com.apple.UIKit.activity.Print": "Imprimir",
  "com.apple.UIKit.activity.AssignToContact": "Asignar a contacto",
  "com.apple.UIKit.activity.SaveToCameraRoll": "Guardar en Fotos",
  "com.apple.UIKit.activity.AddToReadingList": "Lista de lectura",
  "com.apple.UIKit.activity.AirDrop": "AirDrop",
  "com.apple.UIKit.activity.OpenInIBooks": "Libros",
};

const CONTACT_LABEL = "Contacto";

const isNonEmptySegment = (segment: string): boolean => segment !== "";

const STARTS_UPPERCASE = /^[A-Z]/;
const TECHNICAL_SEGMENT = /component|extension/i;

const isHumanSegment = (segment: string): boolean =>
  STARTS_UPPERCASE.test(segment) && !TECHNICAL_SEGMENT.test(segment);

export function formatShareTarget(share: TaskShare): string | null {
  const activityType = share.activityType?.trim();

  if (!activityType) {
    return null;
  }

  const knownLabel = SHARE_TARGET_LABELS[activityType];

  if (knownLabel) {
    return knownLabel;
  }

  const segments = activityType.split(".").filter(isNonEmptySegment);
  const lastSegment = segments[segments.length - 1];

  return lastSegment && isHumanSegment(lastSegment) ? lastSegment : null;
}

export function formatShareLabel(share: TaskShare): string {
  const target = formatShareTarget(share);
  const fallback = share.method === "contact" ? CONTACT_LABEL : null;
  const suffix = target ?? fallback;
  const recipient = share.recipientName ? ` con ${share.recipientName}` : "";
  const suffixLabel = suffix ? ` · ${suffix}` : "";

  return `Compartida${recipient}${suffixLabel}`;
}

export function formatShareCardLabel(share?: TaskShare): string | null {
  if (!share) {
    return null;
  }

  return formatShareLabel(share);
}

export function formatShareDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  return `${day}, ${formatTime(date)}`;
}
