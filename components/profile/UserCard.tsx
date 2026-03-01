import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  darkMode: boolean;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export default function UserCard({ darkMode, name, role, email, phone }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: darkMode ? "#111827" : "#FFFFFF",
          borderColor: darkMode ? "#1F2937" : "#E2E8F0",
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "U"}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: darkMode ? "#FFFFFF" : "#0F172A" }]}>
            {name}
          </Text>
          <Text style={[styles.role, { color: darkMode ? "#CBD5E1" : "#64748B" }]}>
            {role}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: darkMode ? "#1F2937" : "#E2E8F0" },
        ]}
      />

      <View style={styles.item}>
        <Ionicons name="mail-outline" size={18} color={darkMode ? "#CBD5E1" : "#64748B"} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.label, { color: darkMode ? "#94A3B8" : "#64748B" }]}>Email</Text>
          <Text style={[styles.value, { color: darkMode ? "#FFFFFF" : "#0F172A" }]}>{email}</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Ionicons name="call-outline" size={18} color={darkMode ? "#CBD5E1" : "#64748B"} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.label, { color: darkMode ? "#94A3B8" : "#64748B" }]}>Phone</Text>
          <Text style={[styles.value, { color: darkMode ? "#FFFFFF" : "#0F172A" }]}>{phone}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0EA5B7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  name: { fontSize: 18, fontWeight: "800" },
  role: { marginTop: 2, fontSize: 13 },
  divider: { marginVertical: 14, height: 1 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  label: { fontSize: 12 },
  value: { marginTop: 2, fontSize: 14, fontWeight: "600" },
});