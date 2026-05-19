import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Info = {
  key: string;
  label: string;
  value: string;
  valueType?: "status";
};

export default function SystemInfoCard({ data }: { data: Info[] }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerIcon}>
          <Ionicons name="information-circle-outline" size={17} color="#0891b2" />
        </View>
        <Text style={styles.title}>System Information</Text>
      </View>

      <View style={styles.divider} />

      {data.map((row, idx) => {
        const isStatus = row.valueType === "status";
        return (
          <View
            key={row.key}
            style={[styles.line, idx < data.length - 1 && styles.lineBorder]}
          >
            <Text style={styles.label}>{row.label}</Text>
            {isStatus ? (
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{row.value}</Text>
              </View>
            ) : (
              <Text style={styles.value}>{row.value}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6ECF3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E6ECF3",
    marginBottom: 4,
  },
  line: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6ECF3",
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },
});