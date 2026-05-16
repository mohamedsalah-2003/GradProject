import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IconThemeSync from "../components/IconThemeSync";
import { toastConfig } from "../utils/toastConfig";
import SocketListener from "../context/SocketListener";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <IconThemeSync />
        <SocketListener />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig as any} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}