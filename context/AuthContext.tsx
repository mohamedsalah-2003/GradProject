import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";
import { storage } from "../utils/storage";
import { useAlertsStore } from "../app/store/alertsStore";
import { signoutRequest } from "@/services/auth.service";
type User = {
  fullname: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  role?: string;
  profilePicture?: any;
  unreadAlerts?: number;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  isAuthReady: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const unreadCount = useAlertsStore((s) => s.unreadCount);
  const setAlerts = useAlertsStore((state) => state.setAlerts);
  const setUnreadCount = useAlertsStore((state) => state.setUnreadCount);

  useEffect(() => {
    if (!user) return;

    const updatedUser = {
      ...user,
      unreadAlerts: unreadCount,
    };

    setUser(updatedUser);

    storage.set("user", JSON.stringify(updatedUser));
  }, [unreadCount]);
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = await storage.get("user");
        const storedToken = await storage.get("accesstoken");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // optional initial hydration فقط
          setUnreadCount(parsedUser.unreadAlerts ?? 0);
        }

        if (storedToken) {
          connectSocket(storedToken);
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    init();
  }, []);

  const logout = async () => {
    await disconnectSocket();
    await signoutRequest();
    await storage.remove("user");
    await storage.remove("accesstoken");
    await storage.remove("refreshtoken");

    setUser(null);

    // reset alerts state بالكامل
    setAlerts([]);
    setUnreadCount(0);
  };

  const value = useMemo(
    () => ({ user, setUser, isAuthReady, logout }),
    [user, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}