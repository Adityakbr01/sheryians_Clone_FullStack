import { FileText, Home, Package, Percent, Settings, Tag, Users } from "lucide-react";

export const Routes = {
    rootRoute: "http://localhost:3000",
    HOME: "/",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    Admin: {
        routes: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: Home,
                bgColor: "cbg4"
            },
            {
                title: "Courses",
                url: "/admin/courses",
                icon: Package,
                bgColor: "cbg4",
            },
            {
                title: "Users",
                url: "/admin/users",
                icon: Users,
                bgColor: "cbg4"
            },
            {
                title: "Promotionals",
                url: "/admin/promotionals",
                icon: Tag,
                bgColor: "cbg4"
            },
            {
                title: "Coupons",
                url: "/admin/coupons",
                icon: Percent,
                bgColor: "cbg4"
            },
            {
                title: "Audit Logs",
                url: "/admin/auditlogs",
                icon: FileText,
                bgColor: "cbg5"
            },
            {
                title: "Settings",
                url: "/admin/settings",
                icon: Settings,
                bgColor: "cbg3"
            },
        ]
    },

    PROFILE: "/profile",
}


export const APP_CONSTANTS = {
    appName: "www.sheryians.com",
    appVersion: "1.0.0",
    supportEmail: "support@www.sheryians.com",
    defaultLanguage: "en",
    userRole: {
        ADMIN: "admin",
        USER: "user"
    }
};