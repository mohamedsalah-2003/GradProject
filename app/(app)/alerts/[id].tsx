import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Loader from "../../../components/ui/Loader";

import {
  getAlertById,
  markAlertAsResolved,
} from "../../../services/alert.service";

import { AlertItem } from "../../Types/alert";

export default function AlertDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = params.id as string;

  const [alert, setAlert] = useState<AlertItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const loadAlert = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await getAlertById(id);

        const alertData = response.alert ?? response;

        const alertItem: AlertItem = {
          id: alertData._id,
          title: "Anomaly Detected",
          description: alertData.message,
          type:
            alertData.severity === "critical" ||
              alertData.severity === "high"
              ? "Critical"
              : "Warning",
          time: new Date(alertData.createdAt).toLocaleString(),
          unread: !alertData.isRead,
          deviceName: alertData.deviceId?.name ?? "Unknown device",
          deviceId: alertData.deviceId?._id ?? "",
          location:
            alertData.deviceId?.location ??
            alertData.homeId?.name ??
            "Unknown location",
          homeName: alertData.homeId?.name ?? "",
          anomalyType: alertData.anomalyType ?? "Unknown",
          isResolved: alertData.isResolved ?? false,
        };

        setAlert(alertItem);
        setResolved(alertItem.isResolved ?? false);
      } catch (error) {
        console.error("Error loading alert details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadAlert();
  }, [id]);

  const handleResolve = async () => {
    if (resolved || resolving) return;

    try {
      setResolving(true);

      await markAlertAsResolved(id);

      setResolved(true);
    } catch (error) {
      console.error("Error resolving alert:", error);
    } finally {
      setResolving(false);
    }
  };

  const serviceStyle =
    alert?.type === "Critical"
      ? {
        containerBg: "#FEE2E2",
        badgeBg: "#FECACA",
        badgeText: "#B91C1C",
      }
      : {
        containerBg: "#FEF3C7",
        badgeBg: "#FDE68A",
        badgeText: "#92400E",
      };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Loader color="#0891b2" />

          <Text style={[styles.statusTitle, styles.loadText]}>
            Loading alert...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !alert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.statusTitle}>
            Unable to show alert details
          </Text>

          <Text style={styles.statusSubtitle}>
            We couldn’t load this alert. Please go back and try again.
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.actionText}>Back to alerts</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Alert Details</Text>
        </View>

        <View
          style={[
            styles.detailCard,
            { backgroundColor: serviceStyle.containerBg },
          ]}
        >
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: serviceStyle.badgeBg },
            ]}
          >
            <MaterialIcons
              name="error-outline"
              size={18}
              color={serviceStyle.badgeText}
            />

            <Text
              style={[
                styles.severityText,
                { color: serviceStyle.badgeText },
              ]}
            >
              {alert.type}
            </Text>
          </View>

          <Text style={styles.detailTitle}>{alert.title}</Text>

          <Text style={styles.detailSubtitle}>{alert.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Time</Text>
          <Text style={styles.infoValue}>{alert.time}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{alert.location}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Device</Text>
          <Text style={styles.infoValue}>{alert.deviceName}</Text>
        </View>

        {alert.homeName ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Home</Text>
            <Text style={styles.infoValue}>{alert.homeName}</Text>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Anomaly</Text>
          <Text style={styles.infoValue}>{alert.anomalyType}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/devices/${alert.deviceId}`)}
          style={styles.primaryButton}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>View Device</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResolve}
          style={[
            styles.secondaryButton,
            resolved && styles.secondaryButtonResolved,
          ]}
          activeOpacity={0.85}
          disabled={resolved || resolving}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              resolved && styles.secondaryButtonResolvedText,
            ]}
          >
            {resolved
              ? "Resolved"
              : resolving
                ? "Resolving..."
                : "Mark as Resolved"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 16,
    paddingBottom: 36,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  detailCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
  },

  severityBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },

  severityText: {
    fontSize: 13,
    fontWeight: "700",
  },

  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },

  detailSubtitle: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 24,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  infoLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "600",
  },

  primaryButton: {
    marginTop: 10,
    backgroundColor: "#0891B2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  secondaryButtonResolved: {
    backgroundColor: "#E2E8F0",
    borderColor: "#CBD5E1",
  },

  secondaryButtonText: {
    fontWeight: "700",
    color: "#0F172A",
    fontSize: 16,
  },

  secondaryButtonResolvedText: {
    color: "#475569",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  statusTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  statusSubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },

  actionButton: {
    marginTop: 18,
    backgroundColor: "#0891B2",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  loadText: {
    marginTop: 16,
  },
});