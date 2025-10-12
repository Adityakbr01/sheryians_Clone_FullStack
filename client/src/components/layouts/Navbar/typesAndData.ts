export type NavLink = {
    href: string;
    value: string;
    bgColor?: string;
    textColor?: string;
    className?: string;
    isProfile?: boolean;
};

// ✅ Base Links
export const BASE_LINKS: NavLink[] = [
    { href: "/", value: "Home" },
    { href: "/courses", value: "Courses" },
    {
        href: "/Cohort2.0",
        value: "Cohort 2.0",
        textColor: "#BE524B",
        className: "animate-shake-with-pause",
    },
    { href: "/request-callback", value: "Request Callback" },
];

export const SIGNIN_LINK: NavLink = {
    href: "/signin",
    value: "Sign in",
    bgColor: "#24cfa6",
    textColor: "#000",
};

export const CLASSROOM_LINK: NavLink = {
    href: "/classroom",
    value: "Classroom",
};

export const PROFILE_LINK: NavLink = {
    href: "/myAccount",
    value: "Profile",
    isProfile: true,
};