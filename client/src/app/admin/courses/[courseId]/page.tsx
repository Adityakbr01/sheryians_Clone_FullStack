"use client";

import React from "react";
import { useGetCourseById } from "@/hooks/TanStack/courseHooks";
import CourseHeader from "@/components/admin/course/CourseDetails/CourseHeader";
import CourseTabs from "@/components/admin/course/CourseDetails/CourseTabs";


interface PageProps {
    params: { courseId: string };
}

function CourseDetailsAdmin({ params }: PageProps) {

    const { courseId } = params;
    const { data, isLoading, isError, error } = useGetCourseById(courseId);



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
                    Sections={data?.data?.CourseSyllabusSchema?.Sections || []}
                />
            </div>
        </div>
    );
}

export default CourseDetailsAdmin;