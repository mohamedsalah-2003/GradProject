import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { useAlertsStore } from "../app/store/alertsStore";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import { normalizeAlert } from "@/utils/mapAlert";

export default function useAlertsSocket() {
  const addAlert = useAlertsStore((state) => state.addAlert);
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !user) return;

    let socket;
    try {
      socket = getSocket();
    } catch (error) {
      console.log("Socket not connected yet", error);
      return;
    }

    // ── new_alert ────────────────────────────────────────────────────────────
    const handleNewAlert = (data) => {
      const alertItem = normalizeAlert(data.alert);

      // 1. Push to alerts store
      addAlert(alertItem);

      // 2. Update sensors from the reading attached to the alert
      if (data.reading) {
        useAlertsStore.getState().setLatestReading(data.reading);
      }

      // 3. Unread count
      if (typeof data.unreadAlerts === "number") {
        useAlertsStore.getState().setUnreadCount(data.unreadAlerts);
      }

      // 4. Toast
      Toast.show({
        type:
          alertItem.type === "Critical"
            ? "error"
            : alertItem.type === "Warning"
            ? "warning"
            : "success",
        text1: alertItem.title,
        text2: alertItem.description,
        visibilityTime: 3000,
        position: "top",
      });

      console.log("SOCKET ALERT RAW:", data.alert);
      console.log("NORMALIZED:", alertItem);
    };

    // ── new_reading ──────────────────────────────────────────────────────────
    const handleNewReading = (data) => {
      if (data.reading) {
        useAlertsStore.getState().setLatestReading(data.reading);
      }
    };

    // ── Socket events ────────────────────────────────────────────────────────
    socket.on("new_alert",   handleNewAlert);
    socket.on("new_reading", handleNewReading);

    socket.on("connect",    () => console.log("socket connected"));
    socket.on("disconnect", () => console.log("socket disconnected"));

    return () => {
      socket.off("new_alert",   handleNewAlert);
      socket.off("new_reading", handleNewReading);
    };
  }, [addAlert, isAuthReady, user]);
}