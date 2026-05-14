import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { getSocket } from "../services/socket";
import { useAlertsStore } from "../app/store/alertsStore";
import { mapSocketAlertToItem } from "../utils/mapSocketAlert";

export default function useAlertsSocket() {
  const addAlert = useAlertsStore(
    (state) => state.addAlert
  );

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
  }, [addAlert]);
}