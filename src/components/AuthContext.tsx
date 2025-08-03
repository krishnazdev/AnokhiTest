 import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: (userObj: any) => {},
  logout: () => {},
  updateUser: (userObj: any) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // On mount, check localStorage for user or admin_user
    const stored = localStorage.getItem("user") || localStorage.getItem("admin_user");
    if (stored) setUser(JSON.parse(stored));
    // Listen for storage events (multi-tab sync)
    const onStorage = () => {
      const stored = localStorage.getItem("user") || localStorage.getItem("admin_user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (userObj: any, isAdmin = false, token?: string) => {
    setUser(userObj);
    if (isAdmin) {
      localStorage.setItem("admin_user", JSON.stringify(userObj));
      if (token) {
        localStorage.setItem("admin_token", token);
      }
    } else {
      localStorage.setItem("user", JSON.stringify(userObj));
    }
  };

  const updateUser = (userObj: any) => {
    setUser(userObj);
    if (userObj.isAdmin) {
      localStorage.setItem("admin_user", JSON.stringify(userObj));
    } else {
      localStorage.setItem("user", JSON.stringify(userObj));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 