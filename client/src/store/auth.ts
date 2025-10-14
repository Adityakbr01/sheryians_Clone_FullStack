// store/auth.ts
import { Course } from "@/types/course";
import { create } from "zustand";

export type Occupation =
  | "student"
  | "workingProfessional"
  | "intern"
  | "freelancer";


export interface User {
  id: string;
  _id?: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  city: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  enrolledCourses: Course[];
  occupation: Occupation | ""; // "" for unselected state (optional)
}


export interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// Import secure local storage
import { secureLocalStorage } from "@/utils/encryption";

// ✅ Safe get from localStorage with encryption
const getUserFromLocalStorage = (): User | null => {
  if (typeof window !== "undefined") {
    return secureLocalStorage.getItem<User>("user");
  }
  return null;
};

// Get persisted access token if available
const getPersistedToken = (): string | null => {
  if (typeof window !== "undefined") {
    return secureLocalStorage.getItem<string>("accessToken");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getPersistedToken(),
  user: getUserFromLocalStorage(),
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      secureLocalStorage.setItem("user", user);
    }
  },
  clearAuth: () => {
    set({ accessToken: null, user: null });
    if (typeof window !== "undefined") {
      secureLocalStorage.removeItem("user");
      secureLocalStorage.removeItem("accessToken");
    }
  },
}));
