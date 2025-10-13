// shadcn-dashboard.tsx
"use client";

import { AdminDashboardSidebar } from "@/components/admin/AdminDashboardSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function DashboardWithSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    // persist collapse state
    useEffect(() => {
        const saved = localStorage.getItem("dashboard-sidebar-collapsed");
        if (saved !== null) setCollapsed(saved === "true");
    }, []);

    useEffect(() => {
        localStorage.setItem("dashboard-sidebar-collapsed", String(collapsed));
    }, [collapsed]);

    return (
        <div className="min-h-screen flex  text-white">
            <AdminDashboardSidebar />
            <SidebarTrigger />
        </div>
    );
}
