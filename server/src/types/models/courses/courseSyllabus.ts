
// ----------------------
// Interfaces

import mongoose from "mongoose";

// ----------------------
export interface ISubTopic {
    title: string;
    subTopics?: ISubTopic[]; // recursion support
}

export interface ITopic {
    title: string;
    subTopics?: ISubTopic[];
}

export interface ISection {
    title: string; // e.g. "Web Development", "AI and Generative AI"
    topics: ITopic[];
}

export interface ICourseSyllabus extends Document {
    courseId: mongoose.Types.ObjectId;
    syllabus: ISection[];
}