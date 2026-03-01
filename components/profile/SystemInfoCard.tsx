import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Info = {
  key: string;
  label: string;
  value: string;
  valueType?: "status";
};

export default function SystemInfoCard({
  data,
  darkMode,
}: {
  data: Info[];
  darkMode: boolean;
}) {
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
      <Text style={[styles.title, { color: darkMode ? "#FFFFFF" : "#0F172A" }]}>
        System Information
      </Text>

      {data.map((row, idx) => {
        const isStatus = row.valueType === "status";
        return (
          <View
            key={row.key}
            style={[
              styles.line,
              {
                borderBottomColor: darkMode ? "#1F2937" : "#E2E8F0",
                borderBottomWidth: idx === data.length - 1 ? 0 : 1,
              },
            ]}
          >
            <Text style={[styles.label, { color: darkMode ? "#94A3B8" : "#64748B" }]}>
              {row.label}
            </Text>

            <Text
              style={[
                styles.value,
                { color: darkMode ? "#FFFFFF" : "#0F172A" },
                isStatus ? { color: "#10B981" } : null,
              ]}
            >
              {row.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: { fontSize: 14, fontWeight: "800", marginBottom: 10 },
  line: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: "800" },
});