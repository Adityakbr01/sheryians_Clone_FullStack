import CourseSyllabus from "@/models/Courses/courseSyllabus.mode";
import Course from "@/models/Courses/course.model";
import { ApiError } from "@/utils/ApiError";
import mongoose from "mongoose";
import { ISection } from "@/types/models/courses/courseSyllabus";


const syllabusService = {
    getSyllabusByCourseId: async (courseId: string) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({
            courseId: new mongoose.Types.ObjectId(courseId),
        });

        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found for this course");
        }

        console.log("Syllabus found:", syllabus);
        return syllabus;
    },
    createCourseSyllabus: async (courseId: string, syllabusData: ISection[]) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        // Check if a syllabus already exists for this course
        const existingSyllabus = await CourseSyllabus.findOne({ courseId });
        if (existingSyllabus) {
            throw new ApiError(409, "Syllabus already exists for this course");
        }

        // Create the syllabus
        const newSyllabus = await CourseSyllabus.create({
            courseId,
            syllabus: syllabusData,
        });

        // Update course reference to syllabus
        await Course.findByIdAndUpdate(courseId, {
            CourseSyllabusSchema: newSyllabus._id,
        });

        return newSyllabus;
    },
    updateCourseSyllabus: async (courseId: string, syllabusData: ISection[]) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const existingSyllabus = await CourseSyllabus.findOne({ courseId });

        if (!existingSyllabus) {
            throw new ApiError(404, "Syllabus not found for this course");
        }

        // Update the syllabus
        const updatedSyllabus = await CourseSyllabus.findOneAndUpdate(
            { courseId },
            { syllabus: syllabusData },
            { new: true }
        );

        return updatedSyllabus;
    },
    deleteCourseSyllabus: async (courseId: string) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const existingSyllabus = await CourseSyllabus.findOne({ courseId });

        if (!existingSyllabus) {
            throw new ApiError(404, "Syllabus not found for this course");
        }

        // Remove reference from course
        await Course.findByIdAndUpdate(courseId, {
            CourseSyllabusSchema: null,
        });

        // Delete the syllabus
        await CourseSyllabus.deleteOne({ courseId });

        return true;
    },
}

export default syllabusService