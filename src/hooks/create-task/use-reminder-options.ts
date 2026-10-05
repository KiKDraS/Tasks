import { ReminderSelection } from "@/hooks/create-task/types/Reminder";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

type AndroidPicker = "date" | "time" | null;

export function useReminderOptions(
  reminder: ReminderSelection,
  onSelect: (reminder: ReminderSelection) => void,
) {
  const [androidPicker, setAndroidPicker] = useState<AndroidPicker>(null);
  const selectedDate = useMemo(
    () => (reminder.type === "date" ? reminder.date : new Date()),
    [reminder],
  );

  const closeAndroidPicker = useCallback(() => {
    if (Platform.OS === "android") {
      setAndroidPicker(null);
    }
  }, []);

  const handleDateChange = useCallback(
    (date: Date) => {
      const next = new Date(date);
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      onSelect({ type: "date", date: next });
      closeAndroidPicker();
    },
    [closeAndroidPicker, onSelect, selectedDate],
  );

  const handleTimeChange = useCallback(
    (date: Date) => {
      const next = new Date(selectedDate);
      next.setHours(date.getHours(), date.getMinutes(), 0, 0);
      onSelect({ type: "date", date: next });
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
