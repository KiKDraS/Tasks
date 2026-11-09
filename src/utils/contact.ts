import type { TaskContact } from "@/context/tasks/types/Task";

export function formatContactLabel(contact: TaskContact): string {
  return contact.phoneNumber
    ? `${contact.name} · ${contact.phoneNumber}`
    : contact.name;
}
