import { Stack } from "expo-router";
import IconThemeSync from "../components/IconThemeSync";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toastConfig";
export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <IconThemeSync />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig as any} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}