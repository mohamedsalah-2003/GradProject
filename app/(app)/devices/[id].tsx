import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getDevice } from "@/services/devices.service";
import { SafeAreaView } from "react-native-safe-area-context";

interface Device {
  _id: string;
  userId: string;
  homeId: { _id: string; name: string; location: string };
  name: string;
  location: string;
  isActive: boolean;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DeviceDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const background = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#e5e5e5";
  const tint = "#0590b3";
  const card = "#f9fafb";

  useEffect(() => { fetchDeviceDetails(); }, [id]);

  const fetchDeviceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDevice(id as string);
      setDevice(response.device);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load device details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // ─── Sub-components ────────────────────────────────────────────────

  const SectionCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
      <View style={[styles.sectionHeader, { borderBottomColor: border }]}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${tint}18` }]}>
          <Ionicons name={icon as any} size={16} color={tint} />
        </View>
        <Text style={[styles.sectionTitle, { color: text }]}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  const DetailRow = ({
    label,
    value,
    icon,
    mono,
    last,
  }: {
    label: string;
    value: string;
    icon?: string;
    mono?: boolean;
    last?: boolean;
  }) => (
    <View style={[styles.detailRow, !last && { borderBottomColor: border, borderBottomWidth: 1 }]}>
      <View style={styles.detailLabel}>
        {icon && <Ionicons name={icon as any} size={13} color={muted} style={{ marginRight: 5 }} />}
        <Text style={[styles.labelText, { color: muted }]}>{label}</Text>
      </View>
      <Text
        style={[
          styles.valueText,
          { color: text },
          mono && styles.monoText,
        ]}
        numberOfLines={2}
        selectable
      >
        {value}
      </Text>
    </View>
  );

  // ─── Loading ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: background }]}>
        <View style={[styles.topBar, { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={text} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: text }]}>Device Details</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.stateText, { color: muted }]}>Loading device…</Text>
        </View>
      </ThemedView>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────
  if (error || !device) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: background }]}>
        <View style={[styles.topBar, { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={text} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: text }]}>Device Details</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.center}>
          <View style={[styles.stateIconWrap, { backgroundColor: "#ff3b3018" }]}>
            <Ionicons name="alert-circle-outline" size={30} color="#ff3b30" />
          </View>
          <Text style={[styles.stateText, { color: text }]}>{error || "Device not found"}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: tint }]} onPress={fetchDeviceDetails}>
            <Ionicons name="reload-outline" size={15} color="#fff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // ─── Main ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>

      <ThemedView style={[styles.container, { backgroundColor: background }]}>
        {/* Top bar */}
        <View style={[styles.topBar, { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={text} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: text }]}>Device Details</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero card */}
          <View style={[styles.heroCard, { backgroundColor: `${tint}10`, borderColor: border }]}>
            <View style={[styles.heroIcon, { backgroundColor: `${tint}20` }]}>
              <Ionicons name="hardware-chip-outline" size={32} color={tint} />
            </View>
            <View style={styles.heroInfo}>
              <Text style={[styles.heroName, { color: text }]}>{device.name}</Text>
              <View style={styles.heroMeta}>
                <Ionicons name="location-outline" size={13} color={muted} />
                <Text style={[styles.heroMetaText, { color: muted }]}>{device.location}</Text>
              </View>
            </View>
            <View
              style={[
                styles.heroBadge,
                { backgroundColor: device.isActive ? "#22c55e18" : "#ff3b3018" },
              ]}
            >
              <Ionicons
                name={device.isActive ? "checkmark-circle" : "close-circle"}
                size={14}
                color={device.isActive ? "#22c55e" : "#ff3b30"}
              />
              <Text
                style={[
                  styles.heroBadgeText,
                  { color: device.isActive ? "#22c55e" : "#ff3b30" },
                ]}
              >
                {device.isActive ? "Active" : "Offline"}
              </Text>
            </View>
          </View>

          {/* Device Info */}
          <SectionCard title="Device Information" icon="phone-portrait-outline">
            <DetailRow label="Device ID" value={device._id} icon="cube-outline" mono />
            <DetailRow label="Status" value={device.isActive ? "Active" : "Offline"} icon="radio-button-on-outline" />
            <DetailRow label="Last Seen" value={device.lastSeen || "Never"} icon="time-outline" last />
          </SectionCard>

          {/* Location */}
          <SectionCard title="Location" icon="location-outline">
            <DetailRow label="Location" value={device.location} icon="pin-outline" />
            <DetailRow label="Home" value={device.homeId.name} icon="home-outline" />
            <DetailRow label="Home Address" value={device.homeId.location} icon="map-outline" last />
          </SectionCard>

          {/* Timestamps */}
          <SectionCard title="Timestamps" icon="calendar-outline">
            <DetailRow label="Created" value={formatDate(device.createdAt)} icon="add-circle-outline" />
            <DetailRow label="Last Updated" value={formatDate(device.updatedAt)} icon="refresh-outline" last />
          </SectionCard>

          {/* IDs */}
          <SectionCard title="References" icon="information-circle-outline">
            <DetailRow label="User ID" value={device.userId} icon="person-outline" mono />
            <DetailRow label="Home ID" value={device.homeId._id} icon="home-outline" mono last />
          </SectionCard>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 14,
  },

  // Hero
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 2,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  heroInfo: { flex: 1, gap: 5 },
  heroName: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroMetaText: { fontSize: 13 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeText: { fontSize: 12, fontWeight: "700" },

  // Section
  section: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  sectionBody: { paddingHorizontal: 14 },

  // Detail row
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.42,
  },
  labelText: { fontSize: 12, fontWeight: "500" },
  valueText: { fontSize: 13, fontWeight: "600", flex: 0.58, textAlign: "right" },
  monoText: { fontFamily: "monospace", fontSize: 11 },

  // States
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, padding: 20 },
  stateIconWrap: {
    width: 66,
    height: 66,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: { fontSize: 14, fontWeight: "500", textAlign: "center" },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});