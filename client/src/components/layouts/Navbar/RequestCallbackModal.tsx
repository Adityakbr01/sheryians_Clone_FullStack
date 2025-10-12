"use client";

import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { CalendarClock, CircleX } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const courses = [
    { value: "kodr", label: "KODR" },
    { value: "web-development", label: "Web Development" },
    { value: "dsa", label: "DSA" },
    { value: "data-science", label: "Python & Data Science" },
    { value: "java", label: "Java" },
    { value: "c-programming", label: "C Programming" },
    { value: "android", label: "Android" },
    { value: "others", label: "Others" },
];


const enquiryOptions = [
    { value: "online", label: "Online Courses (Website)" },
    { value: "offline", label: "Offline Batches (Bhopal)" },
];


export default function RequestCallbackModal({ isOpen, onClose }: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [datetime, setDatetime] = useState("");
    const [enquiryFor, setEnquiryFor] = useState("online");
    const [courseName, setCourseName] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        datetime: "",
    });

    const modalRef = useRef<HTMLDivElement>(null);

    // 🕒 Auto set current date + 4 hours
    useEffect(() => {
        const now = new Date();
        now.setHours(now.getHours() + 4);

        const localISOTime = new Date(
            now.getTime() - now.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);
        setDatetime(localISOTime);
    }, []);

    // Close modal when clicking outside
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = { name: "", phone: "", datetime: "" };
        let valid = true;

        if (!name.trim()) {
            newErrors.name = "Invalid Name";
            valid = false;
        }
        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Invalid Phone";
            valid = false;
        }
        if (!datetime) {
            newErrors.datetime = "Invalid Date and Time";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            console.log("⏳ Sending fake API request...");
            setTimeout(() => {
                console.log({
                    name,
                    phone,
                    datetime,
                    enquiryFor,
                    courseName: enquiryFor === "online" ? courseName : "N/A",
                });
                console.log("✅ Fake API call completed");
                onClose();
            }, 2000);
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className={clsx(
                "fixed inset-0 bg-black/10 p-8 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300",
                isOpen ? "opacity-100 visible z-[9999]" : "opacity-0 invisible"
            )}
        >
            <div
                ref={modalRef}
                className="bg-[#2C2C2C] text-white md:min-h-[460px] md:w-[310px] p-4 rounded-sm relative"
            >
                {/* Close icons */}
                <div
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={onClose}
                >
                    <CircleX size={18} />
                </div>

                <main className="w-full h-full font-HelveticaNow">
                    {/* Header */}
                    <div className="text-center flex flex-col gap-2 mb-4">
                        <h2 className="text-xl font-medium">Request a Callback</h2>
                        <p className="text-sm leading-5 font-medium">
                            Fill the form below to request a callback from our team.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="name"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Name
                            </Label>
                            <input
                                id="name"
                                placeholder="Enter your name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="py-[0.30rem] w-full rounded-sm outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="phone"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Phone
                            </Label>
                            <input
                                id="phone"
                                placeholder="Enter your phone number"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Datetime */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="datetime"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium flex items-center gap-1"
                            >
                                When should we call you? <CalendarClock size={14} />
                            </Label>
                            <input
                                id="datetime"
                                type="datetime-local"
                                value={datetime}
                                min={datetime}
                                onChange={(e) => setDatetime(e.target.value)}
                                className="py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                            {errors.datetime && (
                                <p className="text-xs text-red-500">{errors.datetime}</p>
                            )}
                        </div>

                        {/* Enquiry Mode (Shadcn Select) */}
                        <div className="space-y-1">
                            <Label className="text-[#a6a6a6] text-[12px] font-medium">
                                Enquiry For
                            </Label>
                            <Select value={enquiryFor} onValueChange={setEnquiryFor}>
                                <SelectTrigger className="py-[0.7rem] w-full rounded-sm border-none outline-none bg-[#1e1e1e] px-4 pr-6 font-light text-[12px]">
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999]">
                                    {enquiryOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Course name - only when online */}
                        {enquiryFor === "online" && (
                            <div className="space-y-1">
                                <Label className="text-[#a6a6a6] text-[12px] font-medium">
                                    Which course
                                </Label>
                                <Select value={courseName} onValueChange={setCourseName}>
                                    <SelectTrigger className="py-[0.70rem] w-full rounded-sm border-none outline-none bg-[#1e1e1e] px-4 pr-6 font-light text-[12px]">
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[9999]">
                                        {courses.map((course) => (
                                            <SelectItem key={course.value} value={course.value}>
                                                {course.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="mt-2 cursor-pointer w-full bg-emerald-400 hover:bg-emerald-500 text-black font-medium py-2 rounded-sm transition-colors duration-200 text-sm"
                        >
                            Submit
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
