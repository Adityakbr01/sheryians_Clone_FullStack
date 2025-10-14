import CourseSyllabus from "@/models/Courses/courseSyllabus.mode";
import Course from "@/models/Courses/course.model";
import { ApiError } from "@/utils/ApiError";
import mongoose from "mongoose";
import { ISection, ISubTopic, ITopic } from "@/types/models/courses/courseSyllabus";

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
    // Section Operations
    addSection: async (courseId: string, section: ISection) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        syllabus.syllabus.push(section);
        await syllabus.save();
        return syllabus;
    },
    updateSection: async (courseId: string, sectionIndex: number, section: ISection) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        syllabus.syllabus[sectionIndex] = section;
        await syllabus.save();
        return syllabus;
    },
    deleteSection: async (courseId: string, sectionIndex: number) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        syllabus.syllabus.splice(sectionIndex, 1);
        await syllabus.save();
        return syllabus;
    },
    // Topic Operations
    addTopic: async (courseId: string, sectionIndex: number, topic: ITopic) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        section.topics.push(topic);
        await syllabus.save();
        return syllabus;
    },
    updateTopic: async (courseId: string, sectionIndex: number, topicIndex: number, topic: ITopic) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        if (topicIndex < 0 || topicIndex >= section.topics.length) {
            throw new ApiError(400, "Invalid topic index");
        }

        section.topics[topicIndex] = topic;
        await syllabus.save();
        return syllabus;
    },

    deleteTopic: async (courseId: string, sectionIndex: number, topicIndex: number) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        if (topicIndex < 0 || topicIndex >= section.topics.length) {
            throw new ApiError(400, "Invalid topic index");
        }

        section.topics.splice(topicIndex, 1);
        await syllabus.save();
        return syllabus;
    },
    // Subtopic Operations
    addSubtopic: async (courseId: string, sectionIndex: number, topicIndex: number, subtopic: ISubTopic) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        if (topicIndex < 0 || topicIndex >= section.topics.length) {
            throw new ApiError(400, "Invalid topic index");
        }

        const topic = section.topics[topicIndex];
        if (!topic) {
            throw new ApiError(400, "Topic not found");
        }

        if (!topic.subTopics) {
            topic.subTopics = [];
        }

        topic.subTopics.push(subtopic);
        await syllabus.save();
        return syllabus;
    },

    updateSubtopic: async (
        courseId: string,
        sectionIndex: number,
        topicIndex: number,
        subtopicIndex: number,
        subtopic: ISubTopic
    ) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        if (topicIndex < 0 || topicIndex >= section.topics.length) {
            throw new ApiError(400, "Invalid topic index");
        }

        const topic = section.topics[topicIndex];
        if (!topic) {
            throw new ApiError(400, "Topic not found");
        }

        if (!topic.subTopics || subtopicIndex < 0 || subtopicIndex >= topic.subTopics.length) {
            throw new ApiError(400, "Invalid subtopic index");
        }

        topic.subTopics[subtopicIndex] = subtopic;
        await syllabus.save();
        return syllabus;
    },

    deleteSubtopic: async (
        courseId: string,
        sectionIndex: number,
        topicIndex: number,
        subtopicIndex: number
    ) => {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, "Invalid course ID format");
        }

        const syllabus = await CourseSyllabus.findOne({ courseId });
        if (!syllabus) {
            throw new ApiError(404, "Syllabus not found");
        }

        if (sectionIndex < 0 || sectionIndex >= syllabus.syllabus.length) {
            throw new ApiError(400, "Invalid section index");
        }

        const section = syllabus.syllabus[sectionIndex];
        if (!section || !section.topics) {
            throw new ApiError(400, "Section topics array is not initialized");
        }

        if (topicIndex < 0 || topicIndex >= section.topics.length) {
            throw new ApiError(400, "Invalid topic index");
        }

        const topic = section.topics[topicIndex];
        if (!topic) {
            throw new ApiError(400, "Topic not found");
        }

        if (!topic.subTopics || subtopicIndex < 0 || subtopicIndex >= topic.subTopics.length) {
            throw new ApiError(400, "Invalid subtopic index");
        }

        topic.subTopics.splice(subtopicIndex, 1);
        await syllabus.save();
        return syllabus;
    }

}



export default syllabusService