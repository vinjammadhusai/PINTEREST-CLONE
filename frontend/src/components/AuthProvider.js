"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getStoredSession, storeSession } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState({ user: null, token: "" });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSession(getStoredSession());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const value = useMemo(
    () => ({
      ...session,
      signIn(nextSession) {
        storeSession(nextSession);
        setSession(nextSession);
      },
      signOut() {
        clearSession();
        setSession({ user: null, token: "" });
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
