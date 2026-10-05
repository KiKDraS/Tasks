import { ThemedText } from "@/components/themed-text";
import { TextField } from "@/components/ui/form/text-field";
import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";
import { Spacing } from "@/constants/theme";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const MAX_HOURS = 99;
const MAX_MINUTES = 59;
const MAX_SECONDS = 59;

type TimeParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

const splitSeconds = (totalSeconds: number): TimeParts => ({
  hours: Math.floor(totalSeconds / SECONDS_PER_HOUR).toString(),
  minutes: Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  ).toString(),
  seconds: (totalSeconds % SECONDS_PER_MINUTE).toString(),
});

const toSeconds = ({ hours, minutes, seconds }: TimeParts) =>
  (Number(hours) || 0) * SECONDS_PER_HOUR +
  (Number(minutes) || 0) * SECONDS_PER_MINUTE +
  (Number(seconds) || 0);

const sanitize = (value: string, max: number) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return String(Math.min(Number(digits), max));
};

interface ReminderCustomTimeProps {
  seconds: number;
  onChange: (seconds: number) => void;
}

export function ReminderCustomTime({
  seconds,
  onChange,
}: Readonly<ReminderCustomTimeProps>) {
  const [parts, setParts] = useState<TimeParts>(() => splitSeconds(seconds));
  const lastEmitted = useRef(seconds);

  useEffect(() => {
    if (seconds === lastEmitted.current) {
      return;
    }
    lastEmitted.current = seconds;
    setParts(splitSeconds(seconds));
  }, [seconds]);

  const updatePart = (key: keyof TimeParts, value: string, max: number) => {
    const next = { ...parts, [key]: sanitize(value, max) };
    const totalSeconds = toSeconds(next);
    lastEmitted.current = totalSeconds;
    setParts(next);
    onChange(totalSeconds);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="label-sm" color="on-surface-variant">
        Personalizado
      </ThemedText>
      <View style={styles.fields}>
        <View style={styles.field}>
          <TextField
            label="Horas"
            value={parts.hours}
            onChangeText={(value) => updatePart("hours", value, MAX_HOURS)}
            placeholder="0"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.field}>
          <TextField
            label="Minutos"
            value={parts.minutes}
            onChangeText={(value) => updatePart("minutes", value, MAX_MINUTES)}
            placeholder="0"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.field}>
          <TextField
            label="Segundos"
            value={parts.seconds}
            onChangeText={(value) => updatePart("seconds", value, MAX_SECONDS)}
            placeholder="0"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-sm"],
  },
  fields: {
    flexDirection: "row",
    gap: Spacing["space-sm"],
  },
  field: {
    flex: 1,
  },
});
