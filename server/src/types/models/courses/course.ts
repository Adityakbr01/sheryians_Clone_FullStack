import mongoose from "mongoose";

export enum CourseLanguage {
    ENGLISH = "English",
    HINDI = "Hindi",
    HINGLISH = "Hinglish",
}

export enum CourseType {
    LIVE = "Live Batch",
    RECORDED = "Recorded",
    HYBRID = "Hybrid",
}

export interface ICourse extends Document {
    title: string;
    slug: string;
    description: string;
    instructor: mongoose.Types.ObjectId; // Ref to User
    gst?: boolean
    price: number;
    originalPrice?: number; // Changed to number for consistency
    discountPercentage: number
    thumbnail: string;
    category: string;
    tags?: string[];
    subTag?: string;
    offer: string,
    CourseLanguage?: CourseLanguage;
    type?: CourseType;
    // --- Fields from your previous schema that are good to have in the interface ---
    providesCertificate?: boolean;
    schedule?: string;
    totalContentHours?: string;
    totalLectures?: string;
    totalQuestions?: string;
    batchStartDate?: Date;
    modules?: {
        title: string;
        lessons: { title: string }[];
    }[];
    isDeleted?: boolean;
    CourseSyllabusSchema?: mongoose.Types.ObjectId; // Ref to CourseSyllabus
}
