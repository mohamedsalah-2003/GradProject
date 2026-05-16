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
  View
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
  homeId: {
    _id: string;
    name: string;
  };
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

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  useEffect(() => {
    if (id) {
      fetchHomeDetails();
      fetchDevices();
    }
  }, [id]);

  const fetchHomeDetails = async () => {
    try {
      const response = await getHomeById(id as string);
      console.log("Home details response:", response);
      // Handle both nested and flat response structures
      const homeData = response?.home || response?.data || response;
      setHomeDetails(homeData);
      setTokenError(false);
    } catch (err) {
      console.log("Error fetching home details:", err);
      if ((err as any).response?.status === 401) {
        setTokenError(true);
      }
    }
  };

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const response = await getHomeDevices(id as string);
      setDevices(response.devices || []);
      setTokenError(false);
    } catch (err) {
      console.log("Error fetching devices:", err);
      if ((err as any).response?.status === 401) {
        setTokenError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = devices.filter((d) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return [d.name, d.location].some((x) =>
      x?.toLowerCase().includes(q)
    );
  });

  const onlineCount = devices.filter((d) => d.isActive).length;

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Token Error Handler */}
      {tokenError && (
        <View style={[styles.errorBanner, { backgroundColor: "#ff3b30" }]}>
          <Text style={styles.errorText}>Session expired. Please login again.</Text>
          <Pressable onPress={() => router.push("/(auth)/login" as any)}>
            <Text style={styles.errorLink}>Go to Login</Text>
          </Pressable>
        </View>
      )}

      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: text }]} numberOfLines={1}>
            {homeName || "Home Details"}
          </Text>
          <Text style={[styles.headerSubtitle, { color: muted }]}>
            {onlineCount} online
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Stats */}
        <View style={[styles.statsRow, { borderBottomColor: border }]}>
          <Text style={[styles.statsText, { color: muted }]}>
            {onlineCount} active • {devices.length} total
          </Text>
        </View>

        {/* Home Details Section */}
        {homeDetails && (
          <View style={[styles.detailsCard, { borderColor: border, backgroundColor: background }]}>
            <Text style={[styles.detailsTitle, { color: text }]}>{homeDetails.name}</Text>
            {homeDetails.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={14} color={muted} />
                <Text style={[styles.detailText, { color: muted }]}>{homeDetails.location}</Text>
              </View>
            )}
            {homeDetails.address && (
              <View style={styles.detailRow}>
                <Ionicons name="home" size={14} color={muted} />
                <Text style={[styles.detailText, { color: muted }]}>{homeDetails.address}</Text>
              </View>
            )}
            {homeDetails.city && (
              <View style={styles.detailRow}>
                <Ionicons name="map" size={14} color={muted} />
                <Text style={[styles.detailText, { color: muted }]}>{homeDetails.city}, {homeDetails.country || ""}</Text>
              </View>
            )}
            {homeDetails.description && (
              <Text style={[styles.descriptionText, { color: text }]}>{homeDetails.description}</Text>
            )}
            <Text style={[styles.dateText, { color: muted }]}>
              Created: {new Date(homeDetails.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Devices Header with Add Button */}
        <View style={[styles.devicesHeader, { borderBottomColor: border }]}>
          <Text style={[styles.devicesHeaderTitle, { color: text }]}>Home Devices</Text>
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
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={tint} />
            <Text style={[styles.loadingText, { color: muted }]}>
              Loading devices...
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="phone-portrait-outline" size={40} color={muted} />
            <Text style={[styles.emptyText, { color: muted }]}>
              {query ? "No devices match your search" : "No devices in this home"}
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            {filtered.map((item) => (
            <Pressable
              key={item._id}
              onPress={() => router.push(`/(app)/devices/${item._id}` as any)}
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
                      📍 {item.location}
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
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Device Modal */}
      <AddDeviceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchDevices}
        homeId={id as string}
      />

      {/* Delete Device Modal */}
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
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  statsText: {
    fontSize: 12,
    fontWeight: "500",
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 12,
  },

  cardPressable: {
    marginBottom: 12,
    marginHorizontal: 0,
  },

  cardPressed: {
    opacity: 0.7,
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  sub: {
    fontSize: 12,
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
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

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 12,
    marginTop: 8,
  },

  emptyText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },

  detailsCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },

  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  detailText: {
    fontSize: 13,
  },

  descriptionText: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 18,
  },

  dateText: {
    fontSize: 11,
    marginTop: 8,
  },

  devicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  devicesHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  errorBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  errorText: {
    color: "#fff",
    fontSize: 13,
    flex: 1,
  },

  errorLink: {
    color: "#fff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
