// app/admin/courses/[courseId]/_components/CourseTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, Section } from "@/types/course";
import { useState } from "react";
import CourseDetailsEditor from "./CourseDetailTab/CourseDetailsEditor";
import SyllabusEditorNestedFixed from "./SyllabusTab/SyllabusEditorNestedFixed";
import api from "@/api/axios";
import toast from "react-hot-toast";


interface CourseTabsProps {
    course: Course;
    syllabus: Section[]; // API structure
}

export default function CourseTabs({ course, syllabus }: CourseTabsProps) {
    const [selectedTab, setSelectedTab] = useState("details");
    const [saving, setSaving] = useState(false);

    // Real API save handler
    const handleSaveSyllabus = async (updatedSyllabus: Section[]) => {
        try {
            setSaving(true);
            console.log("Preparing to save syllabus:", updatedSyllabus);

            if (!course || !course._id) {
                throw new Error("Course ID is required to save syllabus");
            }

            // Create the payload that matches the backend expectation
            const payload = {
                courseId: course._id,
                syllabus: updatedSyllabus
            };

            // Send to API
            const response = await api.put(`/courses/syllabus/${course._id}`, payload);

            console.log("Syllabus save response:", response.data);
            toast.success("Syllabus updated successfully!");
        } catch (error) {
            console.error("Failed to save syllabus:", error);
            toast.error("Failed to update syllabus. Please try again.");
        } finally {
            setSaving(false);
        }
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
                    <SyllabusEditorNestedFixed
                        syllabusData={syllabus}
                        courseId={course._id}
                        onSave={(updatedSyllabus) => handleSaveSyllabus(updatedSyllabus as Section[])}
                        saving={saving}
                    />
                </div>
            </TabsContent>

        </Tabs>
    );
}
