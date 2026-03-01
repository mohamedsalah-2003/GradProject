import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileHeader({ darkMode }: { darkMode: boolean }) {
  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.title,
          { color: darkMode ? "#FFFFFF" : "#0F172A" },
        ]}
      >
        Profile
      </Text>

      <Text
        style={[
          styles.sub,
          { color: darkMode ? "#CBD5E1" : "#64748B" },
        ]}
      >
        Manage your account and settings
      </Text>

      <View
        style={[
          styles.divider,
          { backgroundColor: darkMode ? "#1E293B" : "#E2E8F0" },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800" },
  sub: { marginTop: 6, fontSize: 14 },
  divider: { marginTop: 12, height: 1 },
});