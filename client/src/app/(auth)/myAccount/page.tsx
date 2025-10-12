"use client";

import { useLogout } from "@/hooks/TanStack/mutations/useLogout";
import { useState } from "react";
import CoursesTab from "./CoursesTab";
import MyAccountSidebar from "./MyAccountSidebar";
import PersonalTab from "./PersonalTab";
import { useAuthStore } from "@/store/auth";

export default function AccountCenterSection() {
    const logoutMutation = useLogout();

    const [activeTab, setActiveTab] = useState("personal");
    const user = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser);

    const courses = [
        {
            id: "6867e4147574bb008a1b3040",
            title: "2.0 Job Ready AI Powered Cohort: Web + DSA + Aptitude",
            date: "Enrolled on Aug-19-2025",
            image:
                "https://ik.imagekit.io/sheryians/Cohort%202.0/cohort-3_ekZjBiRzc-2_76HU4-Mz5z.jpeg?updatedAt=1757741949621",
        },
    ];

    return (
        <section
            id="page1"
            className="flex flex-col md:flex-row w-full min-h-screen px-4 md:px-12 text-[var(--custom-textColor)] font-NeuMachina"
        >
            {/* Sidebar / Top Tabs */}
            <MyAccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Right Content */}
            <div className="flex-1 flex flex-col px-2 sm:px-6 md:px-10 py-10 md:py-20 md:mt-24 min-h-screen">
                {activeTab === "personal" ? (
                    <PersonalTab user={user} setUser={setUser} logoutMutation={logoutMutation} />
                ) : (
                    // Courses Tab
                    <CoursesTab courses={courses} />
                )}
            </div>
        </section>
    );
}
