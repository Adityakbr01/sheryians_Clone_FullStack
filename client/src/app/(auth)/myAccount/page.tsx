"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, User, BookOpen, Pencil } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AccountCenterSection() {
    const [activeTab, setActiveTab] = useState("personal");
    const [user, setUser] = useState({
        name: "ADITYA KBR",
        email: "aditykbr01@gmail.com",
        phone: "+919304922632",
        occupation: "student",
        city: "Buxar Bihar",
        image:
            "https://lh3.googleusercontent.com/a/ACg8ocKR-mQ0Hc2gI2Jt-S0zEAOkFevAqln2_kxEwe1D6aT4VsmKYz-o=s96-c",
    });

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
            <div className="w-full md:w-1/4 pt-20 md:pt-32 flex flex-col md:p-6 gap-4 md:gap-6">
                <h1 className="text-2xl md:text-3xl font-extralight mb-2 md:mb-4 text-left">
                    Account Center
                </h1>

                {/* Tabs: Stack vertically on desktop, horizontally on mobile */}
                <div className="flex md:flex-col gap-2 md:gap-3 md:justify-start">
                    <Button
                        variant={activeTab === "personal" ? "secondary" : "ghost"}
                        onClick={() => setActiveTab("personal")}
                        className="justify-center md:justify-start cursor-pointer text-xs md:text-sm"
                    >
                        <User size={16} className="md:mr-2" />
                        Personal
                    </Button>

                    <Button
                        variant={activeTab === "courses" ? "secondary" : "ghost"}
                        onClick={() => setActiveTab("courses")}
                        className="justify-center md:justify-start cursor-pointer text-xs md:text-sm"
                    >
                        <BookOpen size={16} className="md:mr-2" />
                        Courses
                    </Button>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col px-2 sm:px-6 md:px-10 py-10 md:py-20 md:mt-24 min-h-screen">
                {activeTab === "personal" ? (
                    <div className="space-y-8">
                        {/* Profile Image */}
                        <div className="flex sm:flex-row items-center gap-4 sm:gap-6">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gray-700">
                                <Image
                                    src={user.image}
                                    alt={`${user.name} profile`}
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute w-8 h-8 bottom-1 right-1 bg-[var(--custom-primary)] z-20 rounded-full hover:opacity-90"
                                >
                                    <Pencil size={14} />
                                </Button>
                            </div>

                            <div className="text-center sm:text-left">
                                <h2 className="text-lg sm:text-xl font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="mt-1 cursor-not-allowed text-gray-400"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Contact Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    disabled
                                    value={user.phone}
                                    className="mt-1 cursor-not-allowed text-gray-400"
                                />
                            </div>

                            <div>
                                <Label htmlFor="occupation">Occupation</Label>
                                <Select
                                    value={user.occupation}
                                    onValueChange={(value) =>
                                        setUser({ ...user, occupation: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select occupation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="workingProfessional">
                                            Working Professional
                                        </SelectItem>
                                        <SelectItem value="intern">Intern</SelectItem>
                                        <SelectItem value="freelancer">Freelancer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={user.city}
                                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="pt-4 flex justify-center sm:justify-end">
                            <Button asChild variant="destructive" className="w-full sm:w-auto">
                                <Link href="/signin/bye" className="flex items-center gap-2">
                                    <span>Logout</span> <LogOut size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Courses Tab
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="flex flex-col items-center sm:items-start bg-[#2C2C2C] p-4 rounded-lg gap-4 border-none w-full max-w-xs sm:max-w-sm text-white"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-sm font-semibold line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <small className="text-gray-400">{course.date}</small>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-3 w-full justify-center sm:justify-start">
                                    <Button
                                        asChild
                                        className="bg-[var(--custom-primary)] hover:bg-[var(--custom-primary)] text-black text-sm"
                                    >
                                        <Link
                                            href={`/classroom/gotoclassroom/${course.id}`}
                                            className="flex items-center gap-2"
                                        >
                                            Go to Course
                                            <i className="ri-external-link-line"></i>
                                        </Link>
                                    </Button>
                                    <Button className="bg-[#5865F2] hover:bg-[#4752C4] flex items-center gap-2 text-sm">
                                        Discord <i className="ri-discord-line text-lg"></i>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
