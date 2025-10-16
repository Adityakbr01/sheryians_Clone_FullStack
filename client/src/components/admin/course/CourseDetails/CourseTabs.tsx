"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, Section } from "@/types/course";
import { useState } from "react";
import CourseDetailsEditor from "./CourseDetailTab/CourseDetailsEditor";


interface CourseTabsProps {
    course: Course;
    Sections: Section[]; // API structure
}

export default function CourseTabs({ course }: CourseTabsProps) {
    const [selectedTab, setSelectedTab] = useState("details");


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
                    Hello Sir
                </div>
            </TabsContent>

        </Tabs>
    );
}
