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

const activityIcon = (type, title = "", anomalyType = "") => {
  const t = title.toLowerCase();
  const a = (anomalyType || "").toLowerCase().replace(/_/g, " ");

  if (a.includes("fire"))                              return { name: "flame-outline",            color: C.red,      bg: C.redBg    };
  if (a.includes("gas"))                               return { name: "cloud-outline",             color: C.amber,    bg: C.amberBg  };
  if (a.includes("intrusion"))                           return { lib: "MaterialCommunityIcons", name: "robber", color: C.red, bg: C.redBg };
  if (a.includes("motion"))                              return { name: "walk-outline",              color: C.blue,     bg: C.blueBg   };
  if (a.includes("water"))                             return { name: "water-outline",             color: C.blue,     bg: C.blueBg   };
  if (a.includes("energy"))                            return { name: "flash-outline",             color: C.purple,   bg: C.purpleBg };

  if (t.includes("fire"))                              return { name: "flame-outline",            color: C.red,      bg: C.redBg    };
  if (t.includes("gas"))                               return { name: "cloud-outline",             color: C.amber,    bg: C.amberBg  };
  if (t.includes("person") || t.includes("intrusion")) return { lib: "MaterialCommunityIcons", name: "robber", color: C.red, bg: C.redBg };
  if (t.includes("motion"))                            return { name: "walk-outline",              color: C.blue,     bg: C.blueBg   };
  if (t.includes("water"))                             return { name: "water-outline",             color: C.blue,     bg: C.blueBg   };
  if (t.includes("energy"))                            return { name: "flash-outline",             color: C.purple,   bg: C.purpleBg };

  if (type === "Critical")                             return { name: "warning-outline",           color: C.red,      bg: C.redBg    };
  if (type === "Warning")                              return { name: "alert-circle-outline",      color: C.amber,    bg: C.amberBg  };
  if (type === "alert")                                return { name: "notifications-outline",     color: C.red,      bg: C.redBg    };
  return                                                    { name: "checkmark-circle-outline",  color: C.greenDark,bg: C.greenBg  };
};

const ActivityItem = ({ item }) => {
  const { lib = "Ionicons", name, color, bg } = activityIcon(item.type, item.title, item.anomalyType);
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
