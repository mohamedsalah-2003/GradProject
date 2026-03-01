

import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

import DeviceCard from "@/components/DeviceCard";
import { mockDevices } from "@/constants/mockDevices";

export default function DevicesScreen() {
  const [query, setQuery] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockDevices;
    return mockDevices.filter((d) =>
      [d.name, d.type, d.location].some((x) =>
        x.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const onlineCount = useMemo(
    () => mockDevices.filter((d) => d.status === "Online").length,
    []
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={[styles.h1, { color: text }]}>
            Devices
          </ThemedText>
          <ThemedText style={[styles.h2, { color: muted }]}>
            {onlineCount} of {mockDevices.length} devices online
          </ThemedText>
        </View>

        <Pressable
          style={[styles.addBtn, { backgroundColor: tint }]}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.addBtnText}>Add</ThemedText>
        </Pressable>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchWrap,
          { backgroundColor: background, borderColor: border },
        ]}
      >
        <Ionicons name="search" size={18} color={muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search devices..."
          placeholderTextColor={muted}
          style={[styles.searchInput, { color: text }]}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <DeviceCard {...item} />
        )}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 14 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  h1: { fontSize: 34, fontWeight: "800" },
  h2: { marginTop: 4, fontSize: 14 },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  addBtnText: {
    color: "#fff", 
    fontWeight: "700",
    fontSize: 15,
  },

  searchWrap: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});