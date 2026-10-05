import {
  REMINDER_TYPES,
  ReminderSelection,
  ReminderType,
} from "@/hooks/create-task/types/Reminder";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

type AndroidPicker = ReminderType | null;

export function useReminderOptions(
  reminder: ReminderSelection,
  onSelect: (reminder: ReminderSelection) => void,
) {
  const [androidPicker, setAndroidPicker] = useState<AndroidPicker>(null);
  const selectedDate = useMemo(() => {
    const isDateReminder = reminder.type === REMINDER_TYPES.DATE;
    return isDateReminder ? reminder.date : new Date();
  }, [reminder]);

  const closeAndroidPicker = useCallback(() => {
    if (Platform.OS === "android") {
      setAndroidPicker(null);
    }
  }, []);

  const handleDateChange = useCallback(
    (date: Date) => {
      const next = new Date(date);
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      onSelect({ type: REMINDER_TYPES.DATE, date: next });
      closeAndroidPicker();
    },
    [closeAndroidPicker, onSelect, selectedDate],
  );

  const handleTimeChange = useCallback(
    (date: Date) => {
      const next = new Date(selectedDate);
      next.setHours(date.getHours(), date.getMinutes(), 0, 0);
      onSelect({ type: REMINDER_TYPES.DATE, date: next });
      closeAndroidPicker();
    },
    [closeAndroidPicker, onSelect, selectedDate],
  );

  return {
    androidPicker,
    selectedDate,
    handleDateChange,
    handleTimeChange,
    setAndroidPicker,
  };
}
