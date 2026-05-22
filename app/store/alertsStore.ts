import { updateStoredUnreadAlerts } from '../../utils/Auth/authStorage';
import { create } from "zustand";
import { AlertItem } from "../Types/alert";

export const computeSystemStatus = (alerts: AlertItem[]): "alert" | "warning" | "safe" => {
  const active = alerts.filter((a) => !a.isResolved);
  if (active.some((a) => a.type === "Critical")) return "alert";
  if (active.some((a) => a.type === "Warning")) return "warning";
  return "safe";
};

interface AlertsStore {
  alerts: AlertItem[];
  unreadCount: number;
  latestReading: any | null;
  liveSystemStatus: "alert" | "warning" | "safe";
  addAlert: (alert: AlertItem) => void;
  markAlertLocallyAsRead: (id: string) => void;
  markAlertLocallyAsResolved: (id: string) => void;
  setAlerts: (alerts: AlertItem[]) => void;
  setUnreadCount: (count: number) => void;
  removeAlert: (id: string) => void;
  setLatestReading: (reading: any) => void;
  setInitialStatus: (status: "alert" | "warning" | "safe") => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: [],
  unreadCount: 0,
  latestReading: null,
  liveSystemStatus: "safe",

  setLatestReading: (reading: any) => set({ latestReading: reading }),
  setInitialStatus: (status) => set({ liveSystemStatus: status }),

  setAlerts: (alerts) =>
    set({
      alerts,
      unreadCount: alerts.filter((a) => a.unread).length,
      liveSystemStatus: computeSystemStatus(alerts),
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addAlert: (alert) =>
    set((state) => {
      const exists = state.alerts.some((a) => a.id === alert.id);
      if (exists) return state;
      const newAlerts = [alert, ...state.alerts];
      const newUnreadCount = state.unreadCount + (alert.unread ? 1 : 0);
      updateStoredUnreadAlerts(newUnreadCount);
      return {
        alerts: newAlerts,
        unreadCount: newUnreadCount,
        liveSystemStatus: computeSystemStatus(newAlerts),
      };
    }),

  markAlertLocallyAsRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((a) =>
        a.id === id ? { ...a, unread: false } : a
      );
      const wasUnread = state.alerts.some((a) => a.id === id && a.unread);
      return {
        alerts: updated,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  markAlertLocallyAsResolved: (id) =>
    set((state) => {
      const newAlerts = state.alerts.filter((a) => a.id !== id);
      return {
        alerts: newAlerts,
        liveSystemStatus: computeSystemStatus(newAlerts),
      };
    }),

  removeAlert: (id) =>
    set((state) => {
      const newAlerts = state.alerts.filter((a) => a.id !== id);
      return {
        alerts: newAlerts,
        liveSystemStatus: computeSystemStatus(newAlerts),
      };
    }),
}));