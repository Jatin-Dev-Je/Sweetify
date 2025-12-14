import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchProfile } from "@/api/auth.api.js";
import { STORAGE_KEYS } from "@/utils/constants.js";

export const AuthContext = createContext(undefined);

const initialSession = {
  token: null,
  user: null,
  role: null,
};

const readStoredSession = () => {
  const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!rawSession) return null;
  try {
    return JSON.parse(rawSession);
  } catch (error) {
    console.warn("Unable to parse stored session", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(initialSession);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isHydratingProfile, setIsHydratingProfile] = useState(false);

  const persistSession = useCallback((nextSession) => {
    if (nextSession?.token) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, []);

  const setAndPersistSession = useCallback(
    (updater) => {
      setSession((prev) => {
        const nextState = typeof updater === "function" ? updater(prev) : updater;
        persistSession(nextState);
        return nextState;
      });
    },
    [persistSession]
  );

  const clearSession = useCallback(() => {
    persistSession(initialSession);
    setSession(initialSession);
  }, [persistSession]);

  const refreshProfile = useCallback(
    async (tokenOverride) => {
      const storedSession = readStoredSession();
      const activeToken = tokenOverride ?? session.token ?? storedSession?.token;

      if (!activeToken) {
        setIsBootstrapping(false);
        return null;
      }

      setIsHydratingProfile(true);
      try {
        const profile = await fetchProfile();
        setAndPersistSession((prev) => ({
          token: activeToken,
          user: profile.user,
          role: profile.user?.role ?? prev.role,
        }));
        return profile.user;
      } catch (error) {
        clearSession();
        throw error;
      } finally {
        setIsHydratingProfile(false);
        setIsBootstrapping(false);
      }
    },
    [session.token, clearSession, setAndPersistSession]
  );

  useEffect(() => {
    if (session.token) {
      return;
    }

    const stored = readStoredSession();
    if (stored?.token) {
      setAndPersistSession({
        token: stored.token,
        user: stored.user ?? null,
        role: stored.role ?? stored.user?.role ?? null,
      });
      refreshProfile(stored.token).catch(() => {});
    } else {
      setIsBootstrapping(false);
    }
  }, [session.token, refreshProfile, setAndPersistSession]);

  const login = useCallback(
    async (payload) => {
      setAndPersistSession({
        token: payload.token,
        user: payload.user ?? null,
        role: payload.role ?? payload.user?.role ?? null,
      });

      await refreshProfile(payload.token);
    },
    [refreshProfile, setAndPersistSession]
  );

  const logout = useCallback(() => {
    clearSession();
    setIsBootstrapping(false);
  }, [clearSession]);

  const value = useMemo(
    () => ({
      ...session,
      isBootstrapping: isBootstrapping || isHydratingProfile,
      isAuthenticated: Boolean(session.token),
      login,
      logout,
      refreshProfile,
    }),
    [session, isBootstrapping, isHydratingProfile, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
