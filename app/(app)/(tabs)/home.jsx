import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  RefreshControl,
  View,
} from "react-native";

import HeroSection from "../../../components/Home/HeroSection";
import SensorsSection from "../../../components/Home/SensorsSection";
import QuickActionsSection from "../../../components/Home/QuickActionsSection";
import RecentActivitySection from "../../../components/Home/RecentActivitySection";

import { C } from "../../../constants/colors";
import { useAuth } from "../../../context/AuthContext";
import { getDashboard } from "../../../services/home.service";


const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
const { user } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;

const fetchDashboard = useCallback(
  async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await getDashboard();
console.log(data);

      setDashboard(data);

      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

    } catch (e) {
      console.log(e);

      setError("Could not load dashboard.");

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [fadeAnim]
);

  useEffect(() => {
    
    fetchDashboard();

  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard(true);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.greenDark} />
      </View>
    );
  }

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
      <HeroSection
        user={user}
        systemStatus={dashboard?.systemStatus}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <SensorsSection sensors={dashboard?.sensors} />

        <QuickActionsSection />

        <RecentActivitySection
          activities={dashboard?.recentActivity}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    paddingBottom: 20,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bg,
  },
});

export default Home;