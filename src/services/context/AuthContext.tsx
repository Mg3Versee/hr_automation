"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Base64URL decode (small helper, avoids external libs) */
function decodeBase64Url(input: string) {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/** Read exp (seconds since epoch) from JWT, or null */
function getJwtExp(token: string | null): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = decodeBase64Url(parts[1]);
  return payload && typeof payload.exp === "number" ? payload.exp : null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keep a logout timer to auto-sign out at token expiry
  useEffect(() => {
    if (!token) return;

    const exp = getJwtExp(token);
    if (!exp) return;

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      // already expired
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return;
    }

    const id = setTimeout(() => {
      // auto-logout
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }, msUntilExpiry);

    return () => clearTimeout(id);
  }, [token]);

  // Hydrate from localStorage on mount & validate expiry
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        const exp = getJwtExp(storedToken);
        if (exp && exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as User);
        } else {
          // expired
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        const newToken = localStorage.getItem(TOKEN_KEY);
        const newUserRaw = localStorage.getItem(USER_KEY);
        if (newToken && newUserRaw) {
          const exp = getJwtExp(newToken);
          if (exp && exp * 1000 > Date.now()) {
            setToken(newToken);
            setUser(JSON.parse(newUserRaw) as User);
          } else {
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...partial } : (partial as User);
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, token, isAuthenticated, isLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
