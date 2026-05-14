import React from "react";

import { View, Text, StyleSheet } from "react-native";

interface Props {
  unreadCount: number;
}
export default function AlertsHeader({ unreadCount }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.subtitle}>
        {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },
});