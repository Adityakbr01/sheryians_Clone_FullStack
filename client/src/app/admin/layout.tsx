"use client"

import AuthGuard from "@/Guards/AuthGuard"
import DashboardWithSidebar from "./shadcn-dashboard"

function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        //Only For Development
        <AuthGuard allowedRoles={['admin', 'student', 'instructor']}>
            <div className="flex min-h-screen font-NeuMachina p-4 w-full">
                <DashboardWithSidebar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </AuthGuard>
    )
}


export default (DashboardLayout)