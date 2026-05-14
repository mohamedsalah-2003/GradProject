import { create } from "zustand";
import { AlertItem } from "../Types/alert";

interface AlertsStore {
  alerts: AlertItem[];
  unreadCount: number;

  addAlert: (alert: AlertItem) => void;
  markAsRead: (id: string) => void;
  setAlerts: (alerts: AlertItem[]) => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: [],
  unreadCount: 0,

  setAlerts: (alerts) =>
    set({
      alerts,
      unreadCount: alerts.filter((a) => a.unread).length,
    }),

  addAlert: (alert) =>
    set((state) => {
      
      const exists = state.alerts.some((a) => a.id === alert.id);
      if (exists) return state;

      const updated = [alert, ...state.alerts];

      return {
        alerts: updated,
        unreadCount: updated.filter((a) => a.unread).length,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      );

      return {
        alerts: updated,
        unreadCount: updated.filter((a) => a.unread).length,
      };
    }),

    
}));