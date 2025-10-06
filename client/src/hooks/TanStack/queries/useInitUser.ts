// hooks/TanStack/queries/useInitUser.ts
import { useEffect } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";

export const useInitUser = () => {
    const { setUser, clearAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    // Define routes where no redirect should happen on 401
    const publicRoutes = ["/", "/about", "/contact"]; // add any public routes here

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await api.get("/auth/profile");
                setUser(data.data.user);
            } catch (err: any) {
                if (err?.response?.status === 401) {
                    clearAuth();
                    // Only redirect if NOT on a public route
                    if (!publicRoutes.includes(pathname)) {
                        router.push("/signin");
                    }
                }
            }
        };

        loadUser();
    }, [pathname, router, setUser, clearAuth]);
};
