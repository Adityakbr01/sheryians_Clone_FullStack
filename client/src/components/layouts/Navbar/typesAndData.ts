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




export interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const courses = [
    { value: "kodr", label: "KODR" },
    { value: "web-development", label: "Web Development" },
    { value: "dsa", label: "DSA" },
    { value: "data-science", label: "Python & Data Science" },
    { value: "java", label: "Java" },
    { value: "c-programming", label: "C Programming" },
    { value: "android", label: "Android" },
    { value: "others", label: "Others" },
];

export const enquiryOptions = [
    { value: "online", label: "Online Courses (Website)" },
    { value: "offline", label: "Offline Batches (Bhopal)" },
];