import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole, SearchHistoryItem } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, companyName?: string) => Promise<boolean>;
  logout: () => void;
  searchHistory: SearchHistoryItem[];
  addToSearchHistory: (query: string, medicineId?: string, medicineName?: string) => void;
  clearSearchHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: (User & { password: string })[] = [
  { id: "1", email: "admin@rxvault.com", name: "Admin User", role: "admin", password: "admin123" },
  { id: "2", email: "user@rxvault.com", name: "John Doe", role: "user", password: "user123" },
  { id: "3", email: "company@rxvault.com", name: "PharmaCorp", role: "company", companyName: "PharmaCorp Industries", password: "company123" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("rxvault_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedHistory = localStorage.getItem("rxvault_search_history");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("rxvault_user", JSON.stringify(userData));
      return true;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("rxvault_registered_users") || "[]");
    const registeredUser = registeredUsers.find((u: User & { password: string }) => u.email === email && u.password === password);
    if (registeredUser) {
      const { password: _, ...userData } = registeredUser;
      setUser(userData);
      localStorage.setItem("rxvault_user", JSON.stringify(userData));
      return true;
    }

    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole, companyName?: string): Promise<boolean> => {
    const allUsers = [...MOCK_USERS];
    const registeredUsers = JSON.parse(localStorage.getItem("rxvault_registered_users") || "[]");
    allUsers.push(...registeredUsers);

    if (allUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role,
      companyName,
      password,
    };

    registeredUsers.push(newUser);
    localStorage.setItem("rxvault_registered_users", JSON.stringify(registeredUsers));

    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem("rxvault_user", JSON.stringify(userData));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("rxvault_user");
  }, []);

  const addToSearchHistory = useCallback((query: string, medicineId?: string, medicineName?: string) => {
    const item: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      medicineId,
      medicineName,
    };
    setSearchHistory(prev => {
      const updated = [item, ...prev].slice(0, 50);
      localStorage.setItem("rxvault_search_history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem("rxvault_search_history");
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      searchHistory,
      addToSearchHistory,
      clearSearchHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
