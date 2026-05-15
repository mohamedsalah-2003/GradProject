import { create } from "zustand";
import { AlertItem } from "../Types/alert";

interface AlertsStore {
  alerts: AlertItem[];
  unreadCount: number;

  addAlert: (alert: AlertItem) => void;
  markAsRead: (id: string) => void;
  setAlerts: (alerts: AlertItem[]) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: [],
  unreadCount: 0,

  setAlerts: (alerts) =>
    set({
      alerts,
      unreadCount: alerts.filter((a) => a.unread).length,
    }),

  setUnreadCount: (count) =>
    set({
      unreadCount: count,
    }),

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  decrementUnreadCount: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  addAlert: (alert) =>
    set((state) => {
      const exists = state.alerts.some((a) => a.id === alert.id);
      if (exists) return state;

      return {
        alerts: [alert, ...state.alerts],
        unreadCount: state.unreadCount + (alert.unread ? 1 : 0),
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      );

      const wasUnread = state.alerts.some((item) => item.id === id && item.unread);
      return {
        alerts: updated,
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),
}));