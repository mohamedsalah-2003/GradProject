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
  TouchableOpacity,
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

  const background = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#e5e5e5";
  const tint = "#0590b3";
  const card = "#f9fafb" ?? background;

  const fetchDevices = async () => {
    try {
      const data = await getAllDevices();
      setDevices(data.devices || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return devices;
    return devices.filter((d) =>
      [d.name, d.location, d.homeId?.name].some((x) => x?.toLowerCase().includes(q))
    );
  }, [query, devices]);

  const onlineCount = useMemo(() => devices.filter((d) => d.isActive).length, [devices]);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(app)/devices/${item._id}`)}
      style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}
    >
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        {/* Top row */}
        <View style={styles.cardTop}>
          {/* Device icon + status indicator */}
          <View style={styles.iconArea}>
            <View style={[styles.iconWrap, { backgroundColor: `${tint}18` }]}>
              <Ionicons name="hardware-chip-outline" size={22} color={tint} />
            </View>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.isActive ? "#22c55e" : "#ff3b30" },
              ]}
            />
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={[styles.deviceName, { color: text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color={muted} />
              <Text style={[styles.metaText, { color: muted }]} numberOfLines={1}>
                {item.location}
              </Text>
              <Text style={[styles.metaDot, { color: muted }]}>·</Text>
              <Ionicons name="home-outline" size={12} color={muted} />
              <Text style={[styles.metaText, { color: muted }]} numberOfLines={1}>
                {item.homeId?.name}
              </Text>
            </View>
          </View>

          {/* Right actions */}
          <View style={styles.rightCol}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.isActive ? "#22c55e18" : "#ff3b3018" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: item.isActive ? "#22c55e" : "#ff3b30" },
                ]}
              >
                {item.isActive ? "Active" : "Offline"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                setSelectedDeviceId(item._id);
                setSelectedDeviceName(item.name);
                setShowDeleteModal(true);
              }}
              style={[styles.deleteBtn, { backgroundColor: "#ff3b3012" }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={15} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.cardFooter, { borderTopColor: border }]}>
          <View style={styles.footerItem}>
            <Ionicons name="time-outline" size={11} color={muted} />
            <Text style={[styles.footerText, { color: muted }]}>
              {item.lastSeen ? `Seen ${item.lastSeen}` : "Never seen"}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={11} color={muted} />
            <Text style={[styles.footerText, { color: muted }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(app)/dashboard")}
          style={[styles.backBtn, { backgroundColor: `${muted}12` }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>Devices</Text>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <View style={[styles.statDot, { backgroundColor: "#22c55e" }]} />
              <Text style={[styles.statText, { color: muted }]}>{onlineCount} active</Text>
            </View>
            <Text style={[styles.statSep, { color: muted }]}>·</Text>
            <View style={styles.statChip}>
              <Ionicons name="layers-outline" size={12} color={muted} />
              <Text style={[styles.statText, { color: muted }]}>{devices.length} total</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: tint }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { borderColor: border, backgroundColor: `${muted}0A` }]}>
        <Ionicons name="search-outline" size={17} color={muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search devices..."
          placeholderTextColor={muted}
          style={[styles.searchInput, { color: text }]}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={17} color={muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.stateIconWrap, { backgroundColor: `${muted}15` }]}>
            <Ionicons name="hardware-chip-outline" size={28} color={muted} />
          </View>
          <Text style={[styles.stateText, { color: muted }]}>
            {query ? "No devices match your search" : "No devices yet"}
          </Text>
          {!query && (
            <TouchableOpacity
              style={[styles.emptyAction, { backgroundColor: tint }]}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.emptyActionText}>Add your first device</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddDeviceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchDevices}
      />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
    marginTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
  },
  statSep: {
    fontSize: 12,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  cardPressable: {
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconArea: {
    position: "relative",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  cardInfo: {
    flex: 1,
    gap: 5,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    fontSize: 12,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    fontSize: 11,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});