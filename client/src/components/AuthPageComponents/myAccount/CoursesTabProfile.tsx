"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

function CoursesTabProfile({ courses }: { courses: Course[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {courses.map((course, idx: number) => (
                <Card
                    key={idx}
                    className="flex flex-col items-center sm:items-start bg-[#2C2C2C] p-4 rounded-lg gap-4 border-none w-full max-w-xs sm:max-w-sm text-white"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="text-sm font-semibold line-clamp-2">
                                {course.title}
                            </h3>
                            {/* <small className="text-gray-400">{course.date}</small> */}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 w-full justify-center sm:justify-start">
                        <Button
                            asChild
                            className="bg-[var(--custom-primary)] hover:bg-[var(--custom-primary)] text-black text-sm"
                        >
                            <Link
                                href={`/classroom/gotoclassroom/${course.title}`}
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
    )
}

export default CoursesTabProfile