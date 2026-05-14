import { create } from "zustand";

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: "Critical" | "Warning" | "Info";
  time: string;
  unread?: boolean;
}

interface AlertsStore {
  alerts: AlertItem[];

  addAlert: (alert: AlertItem) => void;

  markAsRead: (id: string) => void;

  setAlerts: (alerts: AlertItem[]) => void;
}

export const useAlertsStore = create<AlertsStore>(
  (set) => ({
    alerts: [],

    setAlerts: (alerts) =>
      set({
        alerts,
      }),

    addAlert: (alert) =>
      set((state) => ({
        alerts: [alert, ...state.alerts],
      })),

    markAsRead: (id) =>
      set((state) => ({
        alerts: state.alerts.map((item) =>
          item.id === id
            ? {
                ...item,
                unread: false,
              }
            : item
        ),
      })),
  })
);