import { useState } from "react";
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

export default function Home() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return null; // أو Loader

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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