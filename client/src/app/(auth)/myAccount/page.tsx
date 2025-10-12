"use client";

import { courses } from "@/constants/footerData";
import { useLogout } from "@/hooks/TanStack/mutations/useLogout";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CoursesTab from "../../../components/AuthPageComponents/myAccount/CoursesTab";
import MyAccountSidebar from "../../../components/AuthPageComponents/myAccount/MyAccountSidebar";
import PersonalTab from "../../../components/AuthPageComponents/myAccount/PersonalTab";

export default function AccountCenterSection() {
    const logoutMutation = useLogout();
    const [activeTab, setActiveTab] = useState("personal");
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/signin/bye");
        }
    }, [user, router]);

    return (
        <section
            id="page1"
            className="flex flex-col md:flex-row w-full min-h-screen px-4 md:px-12 text-[var(--custom-textColor)] font-NeuMachina"
        >
            {/* Sidebar / Top Tabs */}
            <MyAccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Right Content */}
            <div className="flex-1 flex flex-col px-2 sm:px-6 md:px-10 py-10 md:py-20 md:mt-24 min-h-screen">
                {user ? (
                    activeTab === "personal" ? (
                        <PersonalTab
                            user={user}
                            setUser={setUser}
                            logoutMutation={logoutMutation}
                        />
                    ) : (
                        <CoursesTab courses={courses} />
                    )
                ) : null}
            </div>
        </section>
    );
}
