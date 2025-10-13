"use client"

import DashboardWithSidebar from "./shadcn-dashboard"

function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen font-NeuMachina p-8 w-full">
            <DashboardWithSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>

    )
}


export default (DashboardLayout)