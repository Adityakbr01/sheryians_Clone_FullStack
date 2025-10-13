"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { Routes } from "@/constants";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";



export function AdminDashboardSidebar() {
    const pathname = usePathname()
    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-black text-white">
                {/* Menu */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Routes?.Admin?.routes?.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={clsx(
                                                    "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                                                    isActive
                                                        ? `${item.bgColor} text-foreground`
                                                        : "hover:bg-muted hover:text-primary-foreground"
                                                )}
                                            >
                                                <item.icon size={18} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
