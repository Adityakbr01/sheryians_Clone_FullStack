"use client";

import React, { useState } from "react";
import CreateCourse from "@/components/admin/course/CreateCourse";
import { useGetCourses } from "@/hooks/TanStack/courseHooks";
import { Course } from "@/types/course"; // move your Course interface here or import
import Image from "next/image";

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
                    <div
                        key={course._id}
                        className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 flex flex-col gap-3"
                    >
                        <div className="relative w-full h-40 bg-gray-800 rounded overflow-hidden">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold">{course.title}</h2>
                            <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                            <span className="text-sm font-medium">
                                ₹{course.price}{" "}
                                {course.originalPrice && (
                                    <span className="text-gray-400 line-through ml-2">
                                        ₹{course.originalPrice}
                                    </span>
                                )}
                            </span>
                            <p className="text-xs text-gray-400">{course.type}</p>
                        </div>

                        <div className="mt-2 flex justify-between">
                            <button
                                onClick={() => handleEdit(course)}
                                className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
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
