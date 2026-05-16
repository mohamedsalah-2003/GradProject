import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { C } from "../../constants/colors";

const activityIcon = (type, title = "") => {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("fire")) {
    return {
      name: "flame-outline",
      color: C.red,
      bg: C.redBg,
    };
  }

  if (normalizedTitle.includes("gas")) {
    return {
      name: "cloud-outline",
      color: C.amber,
      bg: C.amberBg,
    };
  }

  if (
    normalizedTitle.includes("motion") ||
    normalizedTitle.includes("intrusion")
  ) {
    return {
      name: "walk-outline",
      color: C.blue,
      bg: C.blueBg,
    };
  }

  if (normalizedTitle.includes("water")) {
    return {
      name: "water-outline",
      color: C.blue,
      bg: C.blueBg,
    };
  }

  if (normalizedTitle.includes("energy")) {
    return {
      name: "flash-outline",
      color: C.purple,
      bg: C.purpleBg,
    };
  }

  if (type === "alert") {
    return {
      name: "notifications-outline",
      color: C.red,
      bg: C.redBg,
    };
  }

  return {
    name: "checkmark-circle-outline",
    color: C.greenDark,
    bg: C.greenBg,
  };
};

const ActivityItem = ({ item }) => {
  const { name, color, bg } = activityIcon(
    item.type,
    item.title
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: bg,
          },
        ]}
      >
        <Ionicons
          name={name}
          size={18}
          color={color}
        />
      </View>

      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {item.title}
        </Text>

        <Text style={styles.time}>
          {item.timeAgo}
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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

  textContainer: {
    flex: 1,
  },

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