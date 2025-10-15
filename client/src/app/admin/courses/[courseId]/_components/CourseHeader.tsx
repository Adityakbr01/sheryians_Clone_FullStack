// app/admin/courses/[courseId]/_components/CourseHeader.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/types/course";

export default function CourseHeader({ course }: { course: Course }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
                <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                    <Badge className="bg-blue-500 hover:bg-blue-600">{course.category}</Badge>
                    {course.studentsEnrolled && (
                        <Badge variant="outline" className="text-amber-400 border-amber-400">
                            {course.studentsEnrolled} Students
                        </Badge>
                    )}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                    Created {new Date(course.createdAt || "").toLocaleDateString()} · Last updated today
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                    <Badge variant="outline" className="mr-2 bg-green-500/10 text-green-500 border-green-500">
                        {course.type}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500">
                        {course.CourseLanguage}
                    </Badge>
                </div>
                <Separator orientation="vertical" className="h-8 hidden md:block" />
                {/* <ActionButtons courseId={course._id} title={course.title} /> */}
            </div>
        </div>
    );
}
