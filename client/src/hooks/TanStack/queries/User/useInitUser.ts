// hooks/TanStack/queries/useInitUser.ts
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useInitUser = () => {
    const { setUser, clearAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await api.get("/auth/profile");
                setUser(data.data.user);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log(err.message);
                    clearAuth();
                }
            }
        };
        loadUser();
    }, [pathname, router, setUser, clearAuth]);
};
