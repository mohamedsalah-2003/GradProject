import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { useNotifications } from "@/hooks/useNotifications";

// ✅ الـ channel creation جوه useEffect — مش جوه الـ component مباشرة
async function createAndroidChannel() {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    const { AndroidImportance } = require("@notifee/react-native");
    await notifee.createChannel({
      id: "aegisiq_alerts",
      name: "AegisIQ Alerts",
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
    console.log("✅ Android notification channel created");
  } catch (err) {
    console.warn("Channel creation failed:", err);
  }
}

export default function AppLayout() {
  useNotifications(); // ✅ hook صح، جوه component

  useEffect(() => {
    createAndroidChannel();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}