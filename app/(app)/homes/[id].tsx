import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AddDeviceModal from "@/components/Devices/AddDeviceModal";
import DeleteDeviceModal from "@/components/Devices/DeleteDeviceModal";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getHomeById, getHomeDevices } from "@/services/homes.service";

interface Device {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
  lastSeen: string | null;
  createdAt: string;
  homeId: { _id: string; name: string };
}

interface HomeDetails {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomeDevicesScreen() {
  const router = useRouter();
  const { id, name: homeName } = useLocalSearchParams();

  const [devices, setDevices] = useState<Device[]>([]);
  const [homeDetails, setHomeDetails] = useState<HomeDetails | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>();
  const [selectedDeviceName, setSelectedDeviceName] = useState("");
  const [tokenError, setTokenError] = useState(false);

  const background = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#e5e5e5";
  const tint = "#0590b3";
  const card = "#f9fafb" ;

  useEffect(() => {
    if (id) {
      fetchHomeDetails();
      fetchDevices();
    }
  }, [id]);

  const fetchHomeDetails = async () => {
    try {
      const response = await getHomeById(id as string);
      const homeData = response?.home || response?.data || response;
      setHomeDetails(homeData);
      setTokenError(false);
    } catch (err) {
      if ((err as any).response?.status === 401) setTokenError(true);
    }
  };

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const response = await getHomeDevices(id as string);
      setDevices(response.devices || []);
      setTokenError(false);
    } catch (err) {
      if ((err as any).response?.status === 401) setTokenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = devices.filter((d) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return [d.name, d.location].some((x) => x?.toLowerCase().includes(q));
  });

  const onlineCount = devices.filter((d) => d.isActive).length;

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Error Banner */}
      {tokenError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={15} color="#fff" />
          <Text style={styles.errorText}>Session expired</Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login" as any)}
            style={styles.errorAction}
          >
            <Text style={styles.errorActionText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.topBarTitle, { color: text }]} numberOfLines={1}>
            {homeName || "Home Details"}
          </Text>
          <View style={styles.topBarMeta}>
            <View style={[styles.onlineDot, { backgroundColor: onlineCount > 0 ? "#22c55e" : muted }]} />
            <Text style={[styles.topBarSubtitle, { color: muted }]}>
              {onlineCount} online · {devices.length} total
            </Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Home Info Card */}
        {homeDetails && (
          <View style={[styles.homeCard, { backgroundColor: `${tint}0C`, borderColor: border }]}>
            <View style={styles.homeCardTop}>
              <View style={[styles.homeIconWrap, { backgroundColor: `${tint}20` }]}>
                <Ionicons name="home-outline" size={22} color={tint} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.homeName, { color: text }]}>{homeDetails.name}</Text>
                {homeDetails.location && (
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={12} color={muted} />
                    <Text style={[styles.infoText, { color: muted }]}>{homeDetails.location}</Text>
                  </View>
                )}
                {homeDetails.address && (
                  <View style={styles.infoRow}>
                    <Ionicons name="map-outline" size={12} color={muted} />
                    <Text style={[styles.infoText, { color: muted }]}>
                      {homeDetails.address}
                      {homeDetails.city ? `, ${homeDetails.city}` : ""}
                      {homeDetails.country ? `, ${homeDetails.country}` : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {homeDetails.description && (
              <Text style={[styles.homeDescription, { color: muted, borderTopColor: border }]}>
                {homeDetails.description}
              </Text>
            )}

            <View style={[styles.homeFooter, { borderTopColor: border }]}>
              <Ionicons name="calendar-outline" size={11} color={muted} />
              <Text style={[styles.homeFooterText, { color: muted }]}>
                Created {new Date(homeDetails.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* Devices Section Label */}
        <View style={styles.sectionLabel}>
          <Ionicons name="hardware-chip-outline" size={14} color={muted} />
          <Text style={[styles.sectionLabelText, { color: muted }]}>Devices</Text>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { borderColor: border, backgroundColor: `${muted}0A` }]}>
          <Ionicons name="search-outline" size={16} color={muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search devices..."
            placeholderTextColor={muted}
            style={[styles.searchInput, { color: text }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={16} color={muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Device List */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={tint} />
            <Text style={[styles.stateText, { color: muted }]}>Loading devices…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.center}>
            <View style={[styles.stateIconWrap, { backgroundColor: `${muted}15` }]}>
              <Ionicons name="hardware-chip-outline" size={28} color={muted} />
            </View>
            <Text style={[styles.stateText, { color: muted }]}>
              {query ? "No devices match your search" : "No devices in this home"}
            </Text>
            {!query && (
              <TouchableOpacity
                style={[styles.emptyAction, { backgroundColor: tint }]}
                onPress={() => setShowAddModal(true)}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.emptyActionText}>Add a device</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.deviceList}>
            {filtered.map((item, index) => (
              <Pressable
                key={item._id}
                onPress={() => router.push(`/(app)/devices/${item._id}` as any)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
                  <View style={styles.cardTop}>
                    {/* Icon with status dot */}
                    <View style={styles.iconArea}>
                      <View style={[styles.iconWrap, { backgroundColor: `${tint}18` }]}>
                        <Ionicons name="hardware-chip-outline" size={20} color={tint} />
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
                        <Ionicons name="location-outline" size={11} color={muted} />
                        <Text style={[styles.metaText, { color: muted }]} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                    </View>

                    {/* Right */}
                    <View style={styles.cardRight}>
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
            ))}
          </View>
        )}
      </ScrollView>

      <AddDeviceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchDevices}
        homeId={id as string}
      />
      <DeleteDeviceModal
        visible={showDeleteModal}
        deviceId={selectedDeviceId}
        deviceName={selectedDeviceName}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDeviceId(undefined);
          setSelectedDeviceName("");
        }}
        onSuccess={fetchDevices}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: { color: "#fff", fontSize: 13, fontWeight: "500", flex: 1 },
  errorAction: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 6,
  },
  errorActionText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  topBarMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  topBarSubtitle: { fontSize: 12 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: { paddingBottom: 36 },

  // Home card
  homeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  homeCardTop: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  homeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  homeName: { fontSize: 16, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoText: { fontSize: 12 },
  homeDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginHorizontal: 14,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  homeFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
  },
  homeFooterText: { fontSize: 11 },

  // Section label
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionLabelText: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },

  // Device list
  deviceList: { paddingHorizontal: 16 },

  cardPressable: { marginBottom: 10 },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },

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
  iconArea: { position: "relative" },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
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
  cardInfo: { flex: 1, gap: 4 },
  deviceName: { fontSize: 15, fontWeight: "700" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12 },

  cardRight: { alignItems: "flex-end", gap: 8 },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },
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
  footerItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerText: { fontSize: 11 },

  // States
  center: {
    alignItems: "center",
    paddingTop: 40,
    gap: 10,
  },
  stateIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: { fontSize: 14, textAlign: "center" },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});