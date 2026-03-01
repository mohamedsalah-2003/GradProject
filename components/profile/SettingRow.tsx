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
  darkMode?: boolean;
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
  darkMode = false,
}: Props) {
  const bg = darkMode ? "#111827" : "#FFFFFF";
  const bgPressed = darkMode ? "#0B1220" : "#F8FAFC";
  const divider = darkMode ? "#1F2937" : "#E2E8F0";
  const titleColor = darkMode ? "#FFFFFF" : "#0F172A";
  const subColor = darkMode ? "#94A3B8" : "#64748B";
  const iconColor = darkMode ? "#E2E8F0" : "#0F172A";
  const chevronColor = darkMode ? "#64748B" : "#94A3B8";

  return (
    <Pressable
      onPress={type === "link" ? onPress : undefined}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed && type === "link" ? bgPressed : bg },
      ]}
    >
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.mid}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <Text style={[styles.sub, { color: subColor }]}>{subtitle}</Text>
      </View>

      <View style={styles.right}>
        {type === "switch" ? (
          <Switch value={!!value} onValueChange={onToggle} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        )}
      </View>

      {!isLast ? <View style={[styles.divider, { backgroundColor: divider }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 14, paddingHorizontal: 14 },
  left: { width: 34, alignItems: "center", justifyContent: "center" },
  mid: { flex: 1, paddingHorizontal: 10 },
  right: { minWidth: 40, alignItems: "flex-end", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "800" },
  sub: { marginTop: 2, fontSize: 12 },
  divider: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 0,
    height: 1,
  },
});