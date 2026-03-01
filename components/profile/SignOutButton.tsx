import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SignOutButton({
  onPress,
  darkMode,
}: {
  onPress: () => void;
  darkMode: boolean;
}) {
  const border = darkMode ? "#3F1D1D" : "#FCA5A5";
  const bg = darkMode ? "#111827" : "#FFFFFF";
  const text = "#EF4444";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: border, backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Ionicons name="log-out-outline" size={18} color={text} />
      <Text style={[styles.text, { color: text }]}>Sign Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  text: { fontWeight: "900", fontSize: 14 },
});