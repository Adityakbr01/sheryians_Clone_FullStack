"use client";

import React from "react";
import CourseHeader from "./_components/CourseHeader";
import CourseTabs from "./_components/CourseTabs";
import { useGetCourseById } from "@/hooks/TanStack/courseHooks";


const mockSyllabus = [
    {
        section: "Introduction",
        topics: [
            { title: "Course Overview" },
            { title: "Tools Setup" },
        ],
    },
    {
        section: "Frontend",
        topics: [
            { title: "HTML & CSS" },
            { title: "JavaScript Basics" },
            { title: "React Fundamentals" },
        ],
    },
    {
        section: "Backend",
        topics: [
            { title: "Node.js & Express" },
            { title: "MongoDB" },
        ],
    },
];

interface PageProps {
    params: { courseId: string };
}

function CourseDetailsAdmin({ params }: PageProps) {

    const { courseId } = params; // ✅ yahi tumhara [courseId] hai
    console.log("Course ID:", courseId);

    const { data, isLoading, isError, error } = useGetCourseById(courseId);

    console.log("Fetched Course Data:", data);



    // Display loading state while data is being fetched
    if (isLoading) {
        return (
            <div className="h-full w-full text-white p-5 flex items-center justify-center">
                <p>Loading course details...</p>
            </div>
        );
    }

    // Display error state if there was an issue fetching the data
    if (isError || !data?.data) {
        return (
            <div className="h-full w-full text-white p-5 flex items-center justify-center">
                <p>Error loading course: {error?.message || "Course not found"}</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full text-white p-5">
            <CourseHeader course={data.data} />
            <div className="mt-4">
                <CourseTabs
                    course={data.data}
                    syllabus={mockSyllabus}
                />
            </div>
        </div>
    );
}

export default CourseDetailsAdmin;