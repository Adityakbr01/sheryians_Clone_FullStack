"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // roles allowed to access this page
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                // ❌ not logged in
                router.replace("/signin");
                return;
            }

            // 🪄 Default role fallback
            if (!user.role) {
                setUser({ ...user, role: "user" });
            }

            // 🚫 Role restriction check
            const effectiveRole = user.role || "user";
            if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
                router.replace("/unauthorized");
                return;
            }

            setLoading(false);
        };

        checkAuth();
    }, [user, allowedRoles, router, setUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Checking authentication...
            </div>
        );
    }

    return <>{children}</>;
}
