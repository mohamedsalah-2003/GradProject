import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyAlerts() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="notifications-off" size={32} color="#0F172A" />
      </View>

      <Text style={styles.title}>No alerts yet</Text>

      <Text style={styles.subtitle}>
        Your devices are stable right now. We’ll notify you when there’s a new alert.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  iconWrapper: {
    width: 66,
    height: 66,
    borderRadius: 99,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});