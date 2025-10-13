"use client";

import CreateCourse from "@/components/admin/course/CreateCourse";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetCourses } from "@/hooks/TanStack/courseHooks";
import { Course } from "@/types/course"; // move your Course interface here or import
import Image from "next/image";
import { useState } from "react";

function Page() {
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const { data, isLoading } = useGetCourses();
    const courses: Course[] = data?.data || [];

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setIsAddingCourse(true);
    };

    const handleCloseModal = () => {
        setIsAddingCourse(false);
        setEditingCourse(null);
    };

    return (
        <div className="w-full h-full p-8 text-white">
            {/* 🔝 Top bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                <button
                    onClick={() => setIsAddingCourse(true)}
                    className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Add Course
                </button>
            </div>

            {/* 🧭 Loading State */}
            {isLoading && <p>Loading courses...</p>}

            {/* 🧾 Courses List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card
                        key={course._id}
                        className="flex flex-col py-0 bg-[#1a1a1a] border-none text-white min-h-[400px] max-h-[500px] w-full max-w-[400px] mx-auto"
                    >
                        {/* Thumbnail + subTag */}
                        <div className="relative w-full h-48">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={`${course.title} thumbnail`}
                                    fill
                                    className="object-cover rounded-t-md"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    quality={75}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}

                            {course.subTag && (
                                <span className="absolute top-2 right-2 bg-[#fff] text-black text-xs font-HelveticaNow font-medium px-2 py-1 rounded">
                                    {course.subTag}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-3 sm:p-4">
                            {/* Title */}
                            <h2 className="font-NeuMachina text-base sm:text-lg md:text-xl lg:text-2xl text-start line-clamp-2 mb-2">
                                {course.title}
                            </h2>

                            {/* Type + Language badges */}
                            <div className="flex uppercase flex-wrap gap-2 text-xs sm:text-sm font-HelveticaNow text-gray-300 mb-3">
                                {course.type && (
                                    <span className="bg-[#882727] px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                                        {course.type}
                                    </span>
                                )}
                                {course.CourseLanguage && (
                                    <span className="bg-[#2C2C2C] px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                                        {course.CourseLanguage}
                                    </span>
                                )}
                            </div>



                            {/* Price + Offer Section */}
                            <div className="mt-auto flex flex-col gap-2">
                                {course.offer && (
                                    <div className="text-xs sm:text-sm text-start font-HelveticaNow text-[#24cfa6]">
                                        {course.offer}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-base sm:text-lg md:text-xl font-semibold font-HelveticaNow">
                                        ₹{Math.floor(course.price)} {course.gst ? "(+GST)" : ""}
                                    </span>
                                    {course.originalPrice && (
                                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                                            ₹{course.originalPrice}
                                        </span>
                                    )}
                                    {Number(course.discountPercentage) > 1 && (
                                        <span className="text-xs sm:text-sm text-[#24cfa6] font-medium">
                                            <Badge className="bg-white text-black">
                                                {Number(course.discountPercentage)}% off
                                            </Badge>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex justify-between gap-2">
                                <button
                                    onClick={() => handleEdit(course)}
                                    className="bg-green-700 px-3 py-1 cursor-pointer rounded-md hover:bg-green-800 text-sm w-full"
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-[#882727] cursor-pointer px-3 py-1 rounded-md hover:bg-red-700 text-sm w-full"
                                >
                                    Delete
                                </button>
                            </div>

                            <Button
                                className="mt-4 block w-full bg-[#24cfa6] text-black text-center font-HelveticaNow cursor-pointer font-medium py-2 rounded-md hover:bg-[#1bd1a6] transition-colors"
                            >
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}

            </div>

            {/* 🧩 Create / Edit Modal */}
            {isAddingCourse && (
                <CreateCourse
                    isOpen={isAddingCourse}
                    onOpenChange={handleCloseModal}
                    editData={editingCourse} // pass edit data if available
                />
            )}
        </div>
    );
}

export default Page;
