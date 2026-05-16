import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { useAlertsStore } from "../app/store/alertsStore";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import { mapSocketAlertToItem } from "../utils/mapSocketAlert";

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

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("new_alert", handleNewAlert);
    };
  }, [addAlert, isAuthReady, user]);
}