import ShareIcon from "@/components/icons/ShareIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import type { TaskShare } from "@/context/tasks/types/Task";
import { formatShareDate, formatShareLabel } from "@/utils/share-history";
import { StyleSheet, View } from "react-native";
import { AttachmentCard } from "./attachment-card";

interface ShareHistoryCardProps {
  shares: TaskShare[];
}

export function ShareHistoryCard({
  shares,
}: Readonly<ShareHistoryCardProps>) {
  if (shares.length === 0) {
    return null;
  }

  const newestFirst = [...shares].reverse();

  return (
    <AttachmentCard
      icon={<ShareIcon size={20} color={Colors["on-surface"]} />}
      title="Historial de envíos"
    >
      <View style={styles.list}>
        {newestFirst.map((share, index) => (
          <View key={`${share.sharedAt}-${index}`} style={styles.row}>
            <ThemedText type="label-sm" style={styles.label}>
              {formatShareLabel(share)}
            </ThemedText>
            <ThemedText type="label-sm" color="secondary" style={styles.date}>
              {formatShareDate(share.sharedAt)}
            </ThemedText>
          </View>
        ))}
      </View>
    </AttachmentCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing["space-sm"],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing["space-sm"],
  },
  label: {
    flexShrink: 1,
  },
  date: {
    flexShrink: 0,
  },
});
