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
import { getUserAlerts, markAlertAsRead } from "../../../services/alert.service";
import { normalizeAlert } from "@/utils/mapAlert";

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
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [count, setCount] = useState(0);

  const alerts = useAlertsStore((state) => state.alerts);
  const unreadCount = useAlertsStore((state) => state.unreadCount);

  const setAlerts = useAlertsStore((state) => state.setAlerts);
  const setUnreadCount = useAlertsStore((state) => state.setUnreadCount);
  const markAlertLocallyAsRead = useAlertsStore(
    (state) => state.markAlertLocallyAsRead
  );

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    setTokenExpired(false);

    try {
      const response = await getUserAlerts();

      setCount(response.count);
      setUnreadCount(response.unreadCount);

    const apiAlerts = response.alerts.map(normalizeAlert);

      setAlerts(apiAlerts);
    } catch (error: any) {
      if (error?.response?.status === 401) {
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
    if (selectedFilter === "All") return alerts;
    return alerts.filter((a) => a.type === selectedFilter);
  }, [alerts, selectedFilter]);

  const handleAlertPress = async (id: string) => {
    try {
      const res = await markAlertAsRead(id);

      markAlertLocallyAsRead(id);

      if (typeof res.unreadAlerts === "number") {
        setUnreadCount(res.unreadAlerts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      router.push({
        pathname: "/(app)/alerts/[id]",
        params: { id },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Loader color="#0891b2" />
          <Text style={styles.statusTitle}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
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
        <AlertsHeader unreadCount={unreadCount} />

        <Text style={styles.summaryText}>
          {alerts.length} alerts · {unreadCount} unread
        </Text>

        <AlertFilter selected={selectedFilter} onSelect={setSelectedFilter} />

        <FlatList
          data={filteredAlerts}
          keyExtractor={(i) => i.id}
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