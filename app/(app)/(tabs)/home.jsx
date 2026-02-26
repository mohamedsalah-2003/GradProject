import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import HeroSection from "../HeroSection";
import QuickActionsSection from "../QuickActionsSection";
import RecentActivitySection from "../RecentActivitySection";
import SensorsSection from "../SensorsSection";

export default function Home() {


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeroSection />
        <SensorsSection />
        <QuickActionsSection />
        <RecentActivitySection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    // paddingTop: 16,
    paddingBottom: 80,
  },
});