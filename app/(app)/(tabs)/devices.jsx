import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  StatusBar,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllDevices } from "../../../services/devices.service";

export default function DevicesScreen() {
  const [devices, setDevices] = useState([]);
  const [query, setQuery] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const fetchDevices = async () => {
    try {
      const data = await getAllDevices();
      setDevices(data.devices || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return devices;

    return devices.filter((d) =>
      [
        d.name,
        d.location,
        d.homeId?.name,
      ].some((x) => x?.toLowerCase().includes(q))
    );
  }, [query, devices]);

  const onlineCount = useMemo(
    () => devices.filter((d) => d.isActive).length,
    [devices]
  );

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.card, { borderColor: border }]}>
        {/* top row */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: text }]}>
              {item.name}
            </Text>

            <Text style={[styles.sub, { color: muted }]}>
              📍 {item.location} • 🏠 {item.homeId?.name}
            </Text>
          </View>

          {/* status */}
          <View
            style={[
              styles.status,
              {
                backgroundColor: item.isActive ? "#1DB95420" : "#ff3b3020",
              },
            ]}
          >
            <Text
              style={{
                color: item.isActive ? "#1DB954" : "#ff3b30",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {item.isActive ? "Active" : "Offline"}
            </Text>
          </View>
        </View>

        {/* bottom row */}
        <Text style={[styles.meta, { color: muted }]}>
          Last Seen: {item.lastSeen ? item.lastSeen : "Never"} •
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={[styles.h1, { color: text }]}>
            Devices
          </ThemedText>

          <ThemedText style={{ color: muted }}>
            {onlineCount} active • {devices.length} total
          </ThemedText>
        </View>

        <Pressable style={[styles.addBtn, { backgroundColor: tint }]}>
          <Ionicons name="add" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.search, { borderColor: border }]}>
        <Ionicons name="search" size={18} color={muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search devices..."
          placeholderTextColor={muted}
          style={{ flex: 1, color: text }}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  h1: {
    fontSize: 30,
    fontWeight: "800",
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  sub: {
    fontSize: 13,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  meta: {
    marginTop: 10,
    fontSize: 11,
  },
});


