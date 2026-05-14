import { useEffect } from "react";

import { socket } from "./../services/socket";

import { useAlertsStore } from "./../app/store/alertsStore";

export default function useAlertsSocket() {
  const addAlert = useAlertsStore(
    (state) => state.addAlert
  );

  useEffect(() => {
    socket.connect();

    socket.on("new-alert", (data) => {
      addAlert(data);
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("new-alert");

      socket.disconnect();
    };
  }, []);
}