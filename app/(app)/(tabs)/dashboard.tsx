import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  RefreshControl,
  View,
} from "react-native";

import HeroSection from "../../../components/Dashboard/HeroSection";
import SensorsSection from "../../../components/Dashboard/SensorsSection";
import QuickActionsSection from "../../../components/Dashboard/QuickActionsSection";
import RecentActivitySection from "../../../components/Dashboard/RecentActivitySection";

import { C } from "../../../constants/colors";
import { useAuth } from "../../../context/AuthContext";
import { getDashboard } from "../../../services/dashboard.service";
import { useAlertsStore, computeSystemStatus } from "../../store/alertsStore";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Subscribe to global store ──────────────────────────────────────────────
  const alerts = useAlertsStore((s) => s.alerts);
  const latestReading = useAlertsStore((s) => s.latestReading);
  const latestAlert = alerts[0] ?? null;

  // ── systemStatus always derived from current alerts in store ───────────────
  // Recomputes automatically when any alert is resolved or a new one arrives

  const liveSystemStatus = useAlertsStore((s) => s.liveSystemStatus);
  // ── Fetch dashboard ────────────────────────────────────────────────────────


const fetchDashboard = useCallback(async (silent = false) => {
  if (!silent) setLoading(true);
  try {
    const data = await getDashboard();
    setDashboard(data);

    // ← حدّث الـ store بالـ systemStatus الحقيقية من الـ API
    useAlertsStore.getState().setInitialStatus(data.systemStatus);

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  } catch {
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [fadeAnim]);
  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const onRefresh = () => { setRefreshing(true); fetchDashboard(true); };

  // ── React to new alert → update recentActivity only ───────────────────────
  // systemStatus is handled by liveSystemStatus above, no need to set it here
  const prevAlertIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!latestAlert) return;
    if (latestAlert.id === prevAlertIdRef.current) return;
    prevAlertIdRef.current = latestAlert.id;

    setDashboard((prev: any) => {
      if (!prev) return prev;

      const newActivity = {
        id: latestAlert.id,
        type: latestAlert.type,
        title: latestAlert.description,
        time: latestAlert.time,
      };

      return {
        ...prev,
        recentActivity: [newActivity, ...(prev.recentActivity || [])].slice(0, 10),
      };
    });
  }, [latestAlert]);

  // ── React to new reading → update sensors instantly ───────────────────────
  const prevReadingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!latestReading) return;
    if (latestReading._id === prevReadingIdRef.current) return;
    prevReadingIdRef.current = latestReading._id;

    setDashboard((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        sensors: {
          temp: latestReading.temp,
          gas: latestReading.gas,
          smoke: latestReading.smoke,
          motion: latestReading.motion === 1,
          water_flow: latestReading.water_flow,
          power: latestReading.power,
        },
      };
    });
  }, [latestReading]);

  // ── Loading UI ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.greenDark} />
      </View>
    );
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={C.greenDark}
        />
      }
    >
      {/* liveSystemStatus بدل dashboard?.systemStatus عشان يتحدث فوراً */}
      <HeroSection user={user} systemStatus={liveSystemStatus} />

      <Animated.View style={{ opacity: fadeAnim }}>
        <SensorsSection sensors={dashboard?.sensors} />
        <QuickActionsSection />
        <RecentActivitySection activities={dashboard?.recentActivity} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 20 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
});

export default Dashboard;
