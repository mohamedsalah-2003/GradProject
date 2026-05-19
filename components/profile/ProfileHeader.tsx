import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileHeader() {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.sub}>Account & preferences</Text>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons name="person" size={20} color="#0891b2" />
        </View>
      </View>
      <View style={styles.accentBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
    paddingTop: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  accentBar: {
    marginTop: 14,
    height: 2,
    width: 36,
    borderRadius: 2,
    backgroundColor: "#0891b2",
  },
});