import { updateStoredUnreadAlerts } from '../../utils/Auth/authStorage';
import { create } from "zustand";
import { AlertItem } from "../Types/alert";
// ── Helper: compute systemStatus from active (unresolved) alerts ──────────────
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

  addAlert: (alert: AlertItem) => void;
  markAlertLocallyAsRead: (id: string) => void;
  markAlertLocallyAsResolved: (id: string) => void;   // ← جديد
  setAlerts: (alerts: AlertItem[]) => void;
  setUnreadCount: (count: number) => void;
  removeAlert: (id: string) => void;
  setLatestReading: (reading: any) => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: [],
  unreadCount: 0,
  latestReading: null,

  setLatestReading: (reading: any) => set({ latestReading: reading }),

  setAlerts: (alerts) =>
    set({
      alerts,
      unreadCount: alerts.filter((a) => a.unread).length,
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addAlert: (alert) =>
    set((state) => {
      const exists = state.alerts.some((a) => a.id === alert.id);
      if (exists) return state;
      const newUnreadCount =
        state.unreadCount + (alert.unread ? 1 : 0);

      updateStoredUnreadAlerts(newUnreadCount);

      return {
        alerts: [alert, ...state.alerts],
        unreadCount: newUnreadCount,
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

  // ← لما يتعمل markAsResolved من أي شاشة، الـ dashboard يشوف التغيير تلقائياً
  markAlertLocallyAsResolved: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}));
