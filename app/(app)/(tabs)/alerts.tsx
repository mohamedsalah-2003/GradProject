import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AlertCard from "../../../components/Alerts/AlertCard";
import AlertFilter from "../../../components/Alerts/AlertFilter";
import AlertsHeader from "../../../components/Alerts/AlertsHeader";
import EmptyAlerts from "../../../components/Alerts/EmptyAlerts";
import Loader from "../../../components/ui/Loader";

import { useAlertsStore } from "../../../app/store/alertsStore";
import { useAuth } from "../../../context/AuthContext";
import {
  getUserAlerts,
  markAlertAsRead,
} from "../../../services/alert.service";

import { AlertItem } from "../../Types/alert";

export default function Alerts() {
  const router = useRouter();
  const { logout } = useAuth();

  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : 16;

  const contentWidth = useMemo(() => {
    if (isDesktop) return 900;
    if (isTablet) return 700;
    return "100%";
  }, [isDesktop, isTablet]);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const [count, setCount] = useState(0);
  const unreadCount = useAlertsStore((state) => state.unreadCount);
  const setUnreadCount = useAlertsStore((state) => state.setUnreadCount);
  const markAlertRead = useAlertsStore((state) => state.markAsRead);
  const decrementUnreadCount = useAlertsStore((state) => state.decrementUnreadCount);
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    setTokenExpired(false);

    try {
      const response = await getUserAlerts();
      setCount(response.count);
      setUnreadCount(response.unreadCount);
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
          time: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(alert.createdAt)),
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



  const handleSignInAgain = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const handleAlertPress = async (id: string) => {
    try {
      await markAlertAsRead(id);
      markAlertRead(id);
      decrementUnreadCount();
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id
            ? {
                ...alert,
                unread: false,
              }
            : alert
        )
        
      );
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    } finally {
      router.push({
        pathname: "/(app)/alerts/[id]",
        params: { id },
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
        <View
          style={[
            styles.statusCard,
            {
              maxWidth: 520,
              width: "100%",
              padding: isDesktop ? 36 : 28,
            },
          ]}
        >
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
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: horizontalPadding,
            maxWidth: contentWidth,
            width: "100%",
          },
        ]}
      >
        <View style={styles.headerSection}>
          <AlertsHeader unreadCount={unreadCount} />

          <Text style={styles.summaryText}>
            {count} active alert
            {count === 1 ? "" : "s"}
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
          contentContainerStyle={[
            styles.listContent,
            filteredAlerts.length === 0 && {
              flexGrow: 1,
              justifyContent: "center",
            },
          ]}
          ListEmptyComponent={<EmptyAlerts />}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <AlertCard
                item={item}
                onPress={() => handleAlertPress(item.id)}
              />
            </View>
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
    paddingTop: 12,
    alignSelf: "center",
  },

  headerSection: {
    marginBottom: 10,
    width: "100%",
  },

  summaryText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 120,
  },

  cardWrapper: {
    width: "100%",
    alignSelf: "center",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: Platform.OS === "android" ? 4 : 0,
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
    minWidth: 160,
    alignItems: "center",
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