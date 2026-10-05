import { ThemedText } from "@/components/themed-text";
import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { TYPES } from "@/hooks/create-task/constants";
import { useCreateTask } from "@/hooks/create-task/use-create-task";
import { StyleSheet, View } from "react-native";
import { ReminderOptions } from "./reminder-options";

export function CreateTaskForm() {
  const { state, dispatch, handleCreate, reminderLabel } = useCreateTask();
  const showReminderError =
    state.reminderEnabled && Boolean(state.reminderError);
  const showReminderHint = state.reminderEnabled && !showReminderError;

  return (
    <>
      <TextField
        label="Título"
        value={state.title}
        onChangeText={(text) =>
          dispatch({ type: TYPES.SET_TITLE, payload: text })
        }
        placeholder="Ej: Comprar leche"
        error={state.titleError}
      />
      <TextField
        label="Descripción"
        value={state.description}
        onChangeText={(text) =>
          dispatch({ type: TYPES.SET_DESCRIPTION, payload: text })
        }
        placeholder="Detalles de la tarea"
        multiline
      />

      <View style={styles.reminderCard}>
        <ReminderOptions
          enabled={state.reminderEnabled}
          onToggle={() => dispatch({ type: TYPES.TOGGLE_REMINDER })}
          reminder={state.reminder}
          onSelect={(reminder) =>
            dispatch({ type: TYPES.SET_REMINDER, payload: reminder })
          }
        />
          {showReminderError && (
            <ThemedText type="label-sm" color="error">
              {state.reminderError}
            </ThemedText>
          )}
          {showReminderHint && (
            <ThemedText type="label-sm" color="on-surface-variant">
              La notificación se enviará {reminderLabel.toLowerCase()}
            </ThemedText>
          )}
      </View>

      <FormButton
        label="Crear tarea"
        onPress={handleCreate}
        loading={state.isSubmitting}
        disabled={showReminderError}
      />
    </>
  );
}

const styles = StyleSheet.create({
  reminderCard: {
    backgroundColor: Colors["surface-container"],
    borderRadius: Rounded.lg,
    padding: Spacing.gutter,
    gap: Spacing["space-md"],
  },
});
