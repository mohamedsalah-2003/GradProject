
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  name: string;
  type: string;
  location: string;
  status: "Online" | "Offline";
  battery: number;
  lastSeen: string;
};

export default function DeviceCard({
  name,
  type,
  location,
  status,
  battery,
  lastSeen,
}: Props) {
  const isOnline = status === "Online";

  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const onlineColor = useThemeColor({}, "online");
  const onlineBg = useThemeColor({}, "onlineBg");

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.title, { color: text }]}>
            {name}
          </ThemedText>

          <ThemedText style={[styles.sub, { color: muted }]}>
            {type}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: isOnline ? onlineBg : border },
          ]}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isOnline ? onlineColor : muted },
            ]}
          />
          <ThemedText
            style={[
              styles.pillText,
              { color: isOnline ? onlineColor : muted },
            ]}
          >
            {status}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.location, { color: muted }]}>
        {location}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: border }]} />

      <View style={styles.bottomRow}>
        <View style={styles.batteryRow}>
          <Ionicons
            name={
              battery <= 15
                ? "battery-dead-outline"
                : "battery-half-outline"
            }
            size={18}
            color={battery <= 15 ? onlineColor : muted}
          />
          <ThemedText
            style={[
              styles.batteryText,
              { color: battery <= 15 ? onlineColor : muted },
            ]}
          >
            {battery}%
          </ThemedText>
        </View>

        <ThemedText style={[styles.lastSeen, { color: muted }]}>
          {lastSeen}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 18, fontWeight: "700" },
  sub: { marginTop: 2, fontSize: 14 },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 999 },
  pillText: { fontSize: 13, fontWeight: "600" },

  location: { marginTop: 10, fontSize: 14 },
  divider: { height: 1, marginVertical: 12 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  batteryRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  batteryText: { fontSize: 14, fontWeight: "600" },
  lastSeen: { fontSize: 13 },
});