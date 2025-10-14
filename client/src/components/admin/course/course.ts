import { Course } from "@/types/course";
import z from "zod";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";


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

export const CourseLanguageEnum = z.enum([
    CourseLanguage.ENGLISH,
    CourseLanguage.HINDI,
    CourseLanguage.HINGLISH,
]);

export const CourseTypeEnum = z.enum([
    CourseType.LIVE,
    CourseType.RECORDED,
    CourseType.HYBRID,
]);

// Define the schema to match our interface
export const createCourseSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
    originalPrice: z.number().min(0),
    discountPercentage: z.number().min(0).max(100).default(0),
    gst: z.boolean(),
    category: z.string().min(3).max(50),
    tags: z.array(z.string().min(1).max(30)).max(10),
    subTag: z.string().min(1).max(50),
    offer: z
        .string()
        .min(5)
        .max(30)
        .transform((val) =>
            val
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        ),
    thumbnail: z.custom<File | null>((val) => val === null || val instanceof File, {
        message: 'Thumbnail must be a valid file'
    }).nullable(),

    CourseLanguage: CourseLanguageEnum.default(CourseLanguage.HINGLISH),
    type: CourseTypeEnum.default(CourseType.LIVE),
    providesCertificate: z.boolean().default(true),

    totalContentHours: z.string().optional(),
    totalLectures: z.string().optional(),
    totalQuestions: z.string().optional(),

    batchStartDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .nullable(),
    batchDays: z.string().optional(),
    batchTime: z.string().optional(),
});

export const categoryEnum = [
    "Web Development",             // Frontend, Backend, Fullstack
    "AI & Machine Learning",       // ML, Deep Learning, AI tools
    "Data Science & Analytics",    // Python, Pandas, Visualization
    "Cloud & DevOps",              // AWS, Azure, CI/CD
    "Cybersecurity & IT",          // Web security, ethical hacking
    "Productivity & Tools",        // Office tools, VSCode, Notion, etc.
    "Personal Development"         // Soft skills, AI for personal productivity
]


export interface CreateCourseProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editData?: Course | null;
}

export interface CreateCourseFormProps {
    onSubmit: (data: CreateCourseFormValues) => void;
    handleSubmit: UseFormHandleSubmit<CreateCourseFormValues>;
    register: UseFormRegister<CreateCourseFormValues>;
    errors: FieldErrors<CreateCourseFormValues>;
    control: Control<CreateCourseFormValues>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    preview: string | null;
    createCourseMutation: UseMutationResult<unknown, unknown, FormData>;
    updateCourseMutation: UseMutationResult<unknown, unknown, FormData>;
    isEditMode: boolean;
}


// Explicitly defining the type to ensure it matches with the schema
export interface CreateCourseFormValues {
    title: string;
    description: string;
    originalPrice: number;
    category: string;
    subTag: string;
    offer: string;
    gst: boolean;
    providesCertificate: boolean;
    CourseLanguage: CourseLanguage;
    type: CourseType;
    tags: string[];
    discountPercentage: number; // Required number
    thumbnail: File | null; // Explicitly nullable rather than optional
    totalContentHours?: string;
    totalLectures?: string;
    totalQuestions?: string;
    batchStartDate?: string | null;
    batchDays?: string;
    batchTime?: string;
}

// Use this type for consistency between Zod schema and TypeScript interface
// export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;