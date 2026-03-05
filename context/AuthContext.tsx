import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";

type User = {
  fullname: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  role?: string;
  profilePicture?: any;
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

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = await storage.get("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore
      } finally {
        setIsAuthReady(true);
      }
    };

    init();
  }, []);

  const logout = async () => {
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