import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { platformCardStyle } from "./../../app/styles/platformStyles";
import { AlertItem } from "./../../app/Types/alert";
import { alertColors } from "./../../constants/alertColors";

interface Props {
  item: AlertItem;
  onPress?: () => void;
}
export default function AlertCard({
  item,
  onPress,
}: Props) {
  const config = alertColors[item.type];

  const renderIcon = () => {
    switch (item.type) {
      case "Critical":return (
          <MaterialIcons
            name="error-outline"
            size={18}
            color={config.primary}
          />
        );
case "Warning":
        return (
          <Ionicons
            name="warning-outline"
            size={18}
            color={config.primary}
          />
        );

      default:
        return (
          <Feather
            name="info"
            size={18}
            color={config.primary}
          />
        );
    }
  }; return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: config.iconBg,
            },
          ]}
        >
          {renderIcon()}
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{item.title}</Text>

            {item.unread && (
              <View style={styles.unreadDot} />
            )}
          </View>

          <Text style={styles.description}>
            {item.description}
          </Text>

          <View style={styles.bottomRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: config.badgeBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: config.primary,
                  },
                ]}
              >
                {item.type}
              </Text>
            </View>

            <Text style={styles.timeText}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
      card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    ...platformCardStyle,
  },

  leftSection: {
    flexDirection: "row",
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    paddingRight: 10,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 12,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 10,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  timeText: {
    fontSize: 12,
    color: "#94A3B8",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#06B6D4",
  },
});