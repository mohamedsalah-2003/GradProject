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

interface Device {
  _id: string;
  userId: string;
  homeId: {
    _id: string;
    name: string;
    location: string;
  };
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

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  useEffect(() => {
    fetchDeviceDetails();
  }, [id]);

  const fetchDeviceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDevice(id as string);
      setDevice(response.device);
    } catch (err: any) {
      console.error("Error fetching device:", err);
      setError(err?.response?.data?.message || "Failed to load device details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: isActive ? "#1DB95420" : "#ff3b3020",
        },
      ]}
    >
      <Ionicons
        name={isActive ? "checkmark-circle" : "close-circle"}
        size={16}
        color={isActive ? "#1DB954" : "#ff3b30"}
      />
      <Text
        style={{
          color: isActive ? "#1DB954" : "#ff3b30",
          fontWeight: "700",
          fontSize: 12,
          marginLeft: 4,
        }}
      >
        {isActive ? "Active" : "Offline"}
      </Text>
    </View>
  );

  const SectionCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { borderColor: border }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={20} color={tint} />
        <Text style={[styles.sectionTitle, { color: text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const DetailRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon?: string;
  }) => (
    <View style={styles.detailRow}>
      <View style={styles.labelContainer}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={14}
            color={muted}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={[styles.label, { color: muted }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: text }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.loadingText, { color: muted }]}>
            Loading device details...
          </Text>
        </View>
      </ThemedView>
    );
  }

  if (error || !device) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff3b30" />
          <Text style={[styles.errorText, { color: text }]}>
            {error || "Device not found"}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: tint }]}
            onPress={fetchDeviceDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: border, paddingTop: StatusBar.currentHeight || 20 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Device Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Main Device Card */}
        <View style={[styles.mainCard, { backgroundColor: tint + "10", borderColor: border }]}>
          <View style={styles.deviceHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.deviceName, { color: text }]}>
                {device.name}
              </Text>
              <Text style={[styles.deviceLocation, { color: muted }]}>
                📍 {device.location}
              </Text>
            </View>
            <StatusBadge isActive={device.isActive} />
          </View>
        </View>

        {/* Device Information Section */}
        <SectionCard title="Device Information" icon="phone-portrait-outline">
          <View style={styles.sectionContent}>
            <DetailRow
              label="Device ID"
              value={device._id}
              icon="cube-outline"
            />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow label="Status" value={device.isActive ? "Active" : "Offline"} />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow
              label="Last Seen"
              value={device.lastSeen || "Never"}
              icon="time-outline"
            />
          </View>
        </SectionCard>

        {/* Location Information Section */}
        <SectionCard title="Location Information" icon="location-outline">
          <View style={styles.sectionContent}>
            <DetailRow
              label="Location"
              value={device.location}
              icon="pin-outline"
            />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow
              label="Home"
              value={device.homeId.name}
              icon="home-outline"
            />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow
              label="Home Location"
              value={device.homeId.location}
              icon="map-outline"
            />
          </View>
        </SectionCard>

        {/* Timestamps Section */}
        <SectionCard title="Timestamps" icon="calendar-outline">
          <View style={styles.sectionContent}>
            <DetailRow
              label="Created"
              value={formatDate(device.createdAt)}
              icon="add-circle-outline"
            />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow
              label="Last Updated"
              value={formatDate(device.updatedAt)}
              icon="refresh-outline"
            />
          </View>
        </SectionCard>

        {/* Additional Info Section */}
        <SectionCard title="Additional Information" icon="information-circle-outline">
          <View style={styles.sectionContent}>
            <DetailRow label="User ID" value={device.userId} icon="person-outline" />
            <View style={[styles.divider, { backgroundColor: border }]} />
            <DetailRow label="Home ID" value={device.homeId._id} icon="home-outline" />
          </View>
        </SectionCard>
      </ScrollView>
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
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  mainCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  deviceName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },

  deviceLocation: {
    fontSize: 14,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  section: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  sectionContent: {
    gap: 12,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.4,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    flex: 0.6,
    textAlign: "right",
  },

  divider: {
    height: 1,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },

  errorText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
