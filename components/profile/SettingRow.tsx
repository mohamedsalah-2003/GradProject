import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  type: "link" | "switch";
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
};

export default function SettingRow({
  icon,
  title,
  subtitle,
  type,
  value,
  onToggle,
  onPress,
  isLast,
}: Props) {
  return (
    <Pressable
      onPress={type === "link" ? onPress : undefined}
      style={({ pressed }) => [
        styles.row,
        pressed && type === "link" && styles.rowPressed,
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={17} color="#0891b2" />
      </View>

      <View style={styles.mid}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>

      <View style={styles.right}>
        {type === "switch" ? (
          <Switch
            value={!!value}
            onValueChange={onToggle}
            trackColor={{ false: "#E2E8F0", true: "#0891b2" }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <View style={styles.chevronWrap}>
            <Ionicons name="chevron-forward" size={14} color="#0891b2" />
          </View>
        )}
      </View>

      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  rowPressed: {
    backgroundColor: "#F0FAFF",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  mid: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  sub: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    position: "absolute",
    left: 62,
    right: 14,
    bottom: 0,
    height: 1,
    backgroundColor: "#E6ECF3",
  },
});