import { Instagram, Linkedin, Disc2, Youtube, Twitter } from "lucide-react";

export interface Icourse {
    title: string;
    link: string;
    subTag: string;
    image: string;
    language: string;
    type: string;
    offer?: string;
    price: string;
    gst?: string;
    originalPrice: string;
    discount: string;
    description?: string;
}

export const footerData = {
    socials: [
        { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/sheryians_coding_school" },
        { name: "LinkedIn", icon: Linkedin, href: "https://in.linkedin.com/company/the-sheryians-coding-school" },
        { name: "Discord", icon: Disc2, href: "https://discord.gg/D23JkFqrgz" },
        { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@sheryians" },
        { name: "Twitter", icon: Twitter, href: "https://twitter.com/sheryians_" },
    ],
    company: [
        { label: "About Us", href: "/aboutUs" },
        { label: "Support", href: "mailto:hello@sheryians.com" },
        { label: "Privacy Policy", href: "/terms-and-conditions/Terms_and_Conditions.pdf" },
        { label: "Terms and Condition", href: "/terms-and-conditions/Terms_and_Conditions.pdf" },
        { label: "Pricing and Refund", href: "/Pricing&Refund-Policy/Pricing-and-Refund_policy.pdf" },
        { label: "Hire From Us", href: "/hireFromUs" },
        { label: "Submit Projects", href: "/projects" },
    ],
    community: [
        { label: "Discord", href: "https://discord.gg/D23JkFqrgz" },
    ],
    contact: [
        { label: "Online", time: "11am - 8pm", phone: "+91 9993478545" },
        { label: "Offline", time: "11am - 8pm", phone: "+91 96917 78470" },
    ],
    email: "hello@sheryians.com",
    address: {
        line1: "23-B, Indrapuri Sector C,",
        line2: "Bhopal (MP), 462021",
        mapLink: "https://www.google.com/maps/place/Sheryians+Coding+School/@23.2512609,77.4627502,17z",
    },
};



export const courses: Icourse[] = [
    {
        title: "2.0 Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        link: "/courses/courses-details/2.0 Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        subTag: "Job Ready",
        image: "https://ik.imagekit.io/sheryians/cohort-3_ekZjBiRzc.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Early Bird Discount",
        price: "₹ 5999",
        gst: "+ GST",
        originalPrice: "₹11999",
        discount: "50% OFF"
    },
    {
        title: "DSA Domination Cohort",
        link: "/courses/courses-details/DSA Domination Cohort",
        subTag: "Logic Building",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-web-dsa-thumb-10_ZKtPNgmW_.webp_Zhu2w1to5h.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 6600",
        gst: "+ GST",
        originalPrice: "₹ 7500",
        discount: "12% OFF"
    },
    {
        title: "Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        link: "/courses/courses-details/Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        subTag: "Job Ready",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-IMG_5100_7vO7pODI9.JPG",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 5999",
        gst: "+ GST",
        originalPrice: "₹ 11999",
        discount: "50% OFF"
    },
    {
        title: "Three.js Domination",
        link: "/courses/courses-details/Three.js Domination",
        subTag: "ANIMATION",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-maxresdefault_5-AHh9_1Y.jpg",
        language: "Hindi",
        type: "Live Batch",
        offer: "Limited time discount",
        price: "₹ 2499",
        originalPrice: "₹ 3500",
        discount: "29% OFF"
    },
    {
        title: "Java & DSA Domination",
        link: "/courses/courses-details/Java & DSA Domination",
        subTag: "INDEPTH",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-javaas_Large_jY0Wighav__6PygWBZQ.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 4999",
        originalPrice: "₹ 9999",
        discount: "50% OFF"
    },
    {
        title: "Aptitude & Reasoning for Campus Placements",
        link: "/courses/courses-details/Aptitude & Reasoning for Campus Placements",
        subTag: "Placements",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-apti_reasoning_45vyAnZ4y.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 1100",
        originalPrice: "₹ 1999",
        discount: "55% OFF"
    },
    {
        title: "Front-End Domination: Create Anything with Code",
        link: "/courses/courses-details/Front-End Domination: Create Anything with Code",
        subTag: "INDEPTH",
        image: "https://ik.imagekit.io/sheryians/courses_gif/Front-End_Domination__Create_Anything_with_Code-FRONTENDTHUBNAIL_Wf8WqcNJx.jpg",
        language: "Hindi",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 3999",
        originalPrice: "₹ 9999",
        discount: "40% OFF"
    }
];