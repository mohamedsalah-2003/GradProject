import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AlertCard from "../../../components/Alerts/AlertCard";
import AlertFilter from "../../../components/Alerts/AlertFilter";
import AlertsHeader from "../../../components/Alerts/AlertsHeader";
import EmptyAlerts from "../../../components/Alerts/EmptyAlerts";
import Loader from "../../../components/ui/Loader";

import { useAuth } from "../../../context/AuthContext";
import { getUserAlerts, markAlertAsRead } from "../../../services/alert.service";
import { platformContainerWidth } from "../../styles/platformStyles";
import { AlertItem } from "../../Types/alert";

export default function Alerts() {
  const router = useRouter();
  const { logout } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    setTokenExpired(false);

    try {
      const response = await getUserAlerts();

      const apiAlerts = response.alerts.map((alert: any) => {
        const alertType: "Critical" | "Warning" =
          alert.severity === "critical" || alert.severity === "high"
            ? "Critical"
            : "Warning";

        return {
          id: alert._id,
          title: "Anomaly Detected",
          description: alert.message,
          type: alertType,
          time: new Date(alert.createdAt).toLocaleString(),
          unread: !alert.isRead,
          deviceName: alert.deviceId?.name ?? "Unknown device",
          location:
            alert.deviceId?.location ??
            alert.homeId?.name ??
            "Unknown location",
          homeName: alert.homeId?.name ?? "",
          anomalyType: alert.anomalyType ?? "Unknown",
          isResolved: alert.isResolved ?? false,
        };
      });

      setAlerts(apiAlerts);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        setTokenExpired(true);
      } else {
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const filteredAlerts = useMemo(() => {

    if (selectedFilter === "All") {
      return alerts;
    }

    return alerts.filter((item) => item.type === selectedFilter);
  }, [selectedFilter, alerts]);

  const unreadCount = useMemo(
    () => alerts.filter((item) => item.unread).length,
    [alerts]
  );

  const handleSignInAgain = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const handleAlertPress = async (id: string) => {
    try {
      await markAlertAsRead(id);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, unread: false } : alert
        )
      );
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    } finally {
      router.push({
        pathname: "/(app)/alerts/[id]",
        params: { id: id },
      });
    }
  };

  const renderStatusScreen = (
    title: string,
    description: string,
    actionLabel?: string,
    action?: () => void
  ) => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{title}</Text>

          <Text style={styles.statusSubtitle}>{description}</Text>

          {action && actionLabel ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={action}
              activeOpacity={0.8}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Loader color="#0891b2" />

          <Text style={[styles.statusTitle, styles.loadText]}>
            Loading your alerts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (tokenExpired) {
    return renderStatusScreen(
      "Session Expired",
      "Your session has expired. Please sign in again to continue monitoring your alerts.",
      "Sign In Again",
      handleSignInAgain
    );
  }

  if (fetchError) {
    return renderStatusScreen(
      "Unable to Load Alerts",
      "Something went wrong while fetching alerts. Please try again.",
      "Retry",
      fetchAlerts
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <AlertsHeader unreadCount={unreadCount} />

          <Text style={styles.summaryText}>
            {alerts.length} active alert
            {alerts.length === 1 ? "" : "s"}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </Text>
        </View>

        <AlertFilter
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyAlerts />}
          renderItem={({ item }) => (
            <AlertCard
              item={item}
              onPress={() => handleAlertPress(item.id)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    ...platformContainerWidth,
  },

  headerSection: {
    marginBottom: 10,
  },

  summaryText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 120,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  statusCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  statusTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  statusSubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
  },

  actionButton: {
    marginTop: 22,
    backgroundColor: "#0F172A",
    paddingHorizontal: 24,
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