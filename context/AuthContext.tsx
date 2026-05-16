import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAlertsStore } from "../app/store/alertsStore";
import { connectSocket, disconnectSocket } from "../services/socket";
import { storage } from "../utils/storage";

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

  const setUnreadCount = useAlertsStore((state) => state.setUnreadCount);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = await storage.get("user");
        const storedAccessToken = await storage.get("accesstoken");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (typeof parsedUser.unreadAlerts === "number") {
            setUnreadCount(parsedUser.unreadAlerts);
          }
        }

        if (storedAccessToken) {
          connectSocket(storedAccessToken);
        }
      } catch (e) {
        // ignore
      } finally {
        setIsAuthReady(true);
      }
    };

    init();
  }, [setUnreadCount]);

  const logout = async () => {
    await disconnectSocket();
    await storage.remove("user");
    await storage.remove("accesstoken");
    await storage.remove("refreshtoken");
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, isAuthReady, logout }), [user, isAuthReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}