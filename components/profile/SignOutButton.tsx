import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SignOutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
      </View>
      <Text style={styles.text}>Sign Out</Text>
      <Ionicons name="chevron-forward" size={16} color="#EF4444" style={{ marginLeft: "auto" }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  btnPressed: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    fontSize: 14,
    color: "#EF4444",
    letterSpacing: -0.2,
  },
});