// store/auth.ts
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// ✅ Safe get from localStorage
const getUserFromLocalStorage = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: getUserFromLocalStorage(),
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  clearAuth: () => {
    set({ accessToken: null, user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },
}));
