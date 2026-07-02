import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { C } from "../../constants/colors";

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${timeStr}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Yesterday, ${timeStr}`;

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${dateStr}, ${timeStr}`;
};

const ANOMALY_ICONS = {
  fire: {
    name: "flame-outline",
    color: C.red,
    bg: C.redBg,
  },
  gas: {
    name: "cloud-outline",
    color: C.red,
    bg: C.redBg,
  },
  intrusion: {
    lib: "MaterialCommunityIcons",
    name: "robber",
    color: C.red,
    bg: C.redBg,
  },
  water: {
    name: "water-outline",
    color: C.amber,
    bg: C.amberBg,
  },
  energy: {
    name: "flash-outline",
    color: C.amber,
    bg: C.amberBg,
  },
};

const detectAnomaly = (title = "", anomalyType = "") => {
  const sources = [
    (anomalyType || "").toLowerCase().replace(/_/g, " "),
    (title || "").toLowerCase(),
  ].filter(Boolean);

  for (const text of sources) {
    if (text.includes("fire")) return "fire";
    if (text.includes("gas")) return "gas";
    if (
      text.includes("intrusion") ||
      text.includes("unknown person") ||
      text.includes("person detected")
    ) {
      return "intrusion";
    }
    if (text.includes("water")) return "water";
    if (text.includes("energy")) return "energy";
  }

  return null;
};

const activityIcon = (type, title = "", anomalyType = "") => {
  const anomaly = detectAnomaly(title, anomalyType);
  if (anomaly && ANOMALY_ICONS[anomaly]) {
    return ANOMALY_ICONS[anomaly];
  }

  const normalizedType = (type || "").toLowerCase();

  if (normalizedType === "critical" || normalizedType === "high" || normalizedType === "alert") {
    return { name: "warning-outline", color: C.red, bg: C.redBg };
  }

  if (
    normalizedType === "warning" ||
    normalizedType === "medium" ||
    normalizedType === "low"
  ) {
    return { name: "alert-circle-outline", color: C.amber, bg: C.amberBg };
  }

  return { name: "checkmark-circle-outline", color: C.greenDark, bg: C.greenBg };
};

const ActivityItem = ({ item }) => {
  const { lib = "Ionicons", name, color, bg } = activityIcon(
    item.type || item.severity,
    item.title,
    item.anomalyType
  );
  const Icon = lib === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Icon name={name} size={18} color={color} />
      </View>

      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.time}>
          {item.time === "Just now" ? "Just now" : formatTime(item.time)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
  },
  time: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
});

export default ActivityItem;
