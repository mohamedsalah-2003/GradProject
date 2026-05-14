import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AddDeviceModal from "@/components/Devices/AddDeviceModal";
import DeleteDeviceModal from "@/components/Devices/DeleteDeviceModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllDevices } from "../../../services/devices.service";

export default function DevicesScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState("");

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
      <Pressable
        onPress={() => router.push(`/(app)/devices/${item._id}`)}
        style={({ pressed }) => [
          styles.cardPressable,
          pressed && styles.cardPressed,
        ]}
      >
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

            {/* Actions */}
            <View style={styles.actions}>
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

              {/* Delete button */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  setSelectedDeviceId(item._id);
                  setSelectedDeviceName(item.name);
                  setShowDeleteModal(true);
                }}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#ff3b30" />
              </Pressable>
            </View>
          </View>

          {/* bottom row */}
          <Text style={[styles.meta, { color: muted }]}>
            Last Seen: {item.lastSeen ? item.lastSeen : "Never"} •
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
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

        <Pressable 
          style={[styles.addBtn, { backgroundColor: tint }]}
          onPress={() => setShowAddModal(true)}
        >
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

      {/* Add Device Modal */}
      <AddDeviceModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchDevices}
      />

      {/* Delete Device Modal */}
      <DeleteDeviceModal
        visible={showDeleteModal}
        deviceId={selectedDeviceId}
        deviceName={selectedDeviceName}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDeviceId(null);
          setSelectedDeviceName("");
        }}
        onSuccess={fetchDevices}
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

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  meta: {
    marginTop: 10,
    fontSize: 11,
  },
});


