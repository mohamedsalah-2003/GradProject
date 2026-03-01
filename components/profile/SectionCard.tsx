import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
  darkMode?: boolean;
};

export default function SectionCard({ title, children, darkMode = false }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: darkMode ? "#FFFFFF" : "#0F172A" }]}>
        {title}
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: darkMode ? "#111827" : "#FFFFFF",
            borderColor: darkMode ? "#1F2937" : "#E2E8F0",
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  title: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
});