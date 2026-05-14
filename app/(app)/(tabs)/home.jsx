import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import HeroSection from "./../../../components/Home/HeroSection";
import QuickActionsSection from "./../../../components/Home/QuickActionsSection";
import RecentActivitySection from "./../../../components/Home/RecentActivitySection";
import SensorsSection from "./../../../components/Home/SensorsSection";
import { useAuth } from "../../../context/AuthContext";
import { getSocket } from "../../../services/socket";
import { useAlertsStore } from "../../store/alertsStore";
import { mapSocketAlertToItem } from "../../../utils/mapSocketAlert";

import Toast from "react-native-toast-message";

export default function Home() {
  const addAlert = useAlertsStore((state) => state.addAlert);
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    const socket = getSocket();

const handleNewAlert = (data) => {
  const alertItem = mapSocketAlertToItem(data);

  addAlert(alertItem);

  Toast.show({
    type:
      alertItem.type === "Critical"
        ? "error"
        : alertItem.type === "Warning"
        ? "info"
        : "success",

    text1: alertItem.title,
    text2: alertItem.description,

    visibilityTime: 3000,
    position: "top",
  });
};

    socket.on("new_alert", handleNewAlert);

    return () => {
      socket.off("new_alert", handleNewAlert);
    };
  }, [addAlert]);

  if (!isAuthReady) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection name={user?.fullname || "User"} />
        <SensorsSection />
        <QuickActionsSection />
        <RecentActivitySection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    // paddingTop: 16,
    paddingBottom: 80,
  },
});