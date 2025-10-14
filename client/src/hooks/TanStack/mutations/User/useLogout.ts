// src/hooks/TanStack/mutations/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
        },
        onSuccess: () => {
            clearAuth();
            toast.success("Logged out successfully");
            router.push("/signin"); // 👈 Optional: redirect
        },
    });
};
