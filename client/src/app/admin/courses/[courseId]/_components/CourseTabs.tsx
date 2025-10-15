// app/admin/courses/[courseId]/_components/CourseTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/types/course";
import { useState } from "react";
import CourseDetailsEditor from "./CourseDetailsEditor";
import SyllabusEditorNestedFixed from "./SyllabusEditorNestedFixed";

interface CourseTabsProps {
    course: Course;
    syllabus: {
        section: string;
        topics: {
            title: string;
        }[];
    }[];
}

export default function CourseTabs({ course, syllabus }: CourseTabsProps) {
    const [selectedTab, setSelectedTab] = useState("details");
    // Define type for our nested syllabus structure
    interface SubTopic {
        id: string;
        title: string;
    }

    interface Topic {
        id: string;
        title: string;
        subtopics: SubTopic[];
    }

    interface Section {
        id: string;
        section: string;
        topics: Topic[];
    }

    // Mock save handlers
    const handleSaveSyllabus = (updatedSyllabus: Section[] | { section: string; topics: { title: string }[] }[]) => {
        console.log("Saving syllabus:", updatedSyllabus);
        alert("Syllabus updated successfully!");
    };

    return (
        <Tabs defaultValue="details" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent ">
                <TabsTrigger value="details" className="text-[#e9e9e9] font-HelveticaNow data-[state=active]:text-[#1bd1a6] cursor-pointer">Details</TabsTrigger>
                <TabsTrigger value="syllabus" className="text-[#e9e9e9] font-HelveticaNow data-[state=active]:text-[#1bd1a6] cursor-pointer">Syllabus</TabsTrigger>

            </TabsList>

            <TabsContent value="details" className="bg-transparent">
                <div className="mt-5 p-4 rounded-lg">
                    <CourseDetailsEditor course={course} />
                </div>
            </TabsContent>

            <TabsContent value="syllabus" className="bg-transparent">
                <div className="mt-5 p-4 rounded-lg">
                    <SyllabusEditorNestedFixed onSave={handleSaveSyllabus} />
                </div>
            </TabsContent>

        </Tabs>
    );
}
