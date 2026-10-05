import {
  REMINDER_TYPES,
  ReminderSelection,
  ReminderType,
} from "@/context/tasks/types/Reminder";
import {
  mergePickedDate,
  mergePickedTime,
} from "@/hooks/task-form/utils/reminder";
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
      onSelect({
        type: REMINDER_TYPES.DATE,
        date: mergePickedDate(selectedDate, date),
      });
      closeAndroidPicker();
    },
    [closeAndroidPicker, onSelect, selectedDate],
  );

  const handleTimeChange = useCallback(
    (date: Date) => {
      onSelect({
        type: REMINDER_TYPES.DATE,
        date: mergePickedTime(selectedDate, date),
      });
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
