import { CourseLanguage, CourseStatus, CourseType } from "@/types/models/courses/course";
import { z } from "zod";

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

export const CourseStatusEnum = z.enum([
    CourseStatus.UPCOMING,
    CourseStatus.ONGOING,
    CourseStatus.COMPLETED,
]);

export const createCourseSchema = z.object({
    title: z.string().min(5).max(100),
    slug: z.string().optional(), // generated from title in backend
    description: z.string().min(20).max(2000),
    instructor: z.string().length(24), // Mongo ObjectId as string

    originalPrice: z.coerce.number().min(0),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),

    gst: z.boolean().optional().default(true),
    category: z.string().min(3).max(50),
    tags: z.array(z.string().min(1).max(30)).max(10),
    subTag: z.string().min(1).max(50),
    offer: z
        .string()
        .min(5)
        .max(30)
        .transform((val) =>
            val
                .toLowerCase()                     // sab small letters me convert
                .split(" ")                        // words me split
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // first letter capital
                .join(" ")                         // wapas join
        ),
    thumbnail: z.string().url().optional().nullable(), // file

    CourseLanguage: CourseLanguageEnum.default(CourseLanguage.HINGLISH),
    type: CourseTypeEnum.default(CourseType.LIVE),
    providesCertificate: z.boolean().optional().default(true),

    schedule: z.string().optional(),
    totalContentHours: z.string().optional(),
    totalLectures: z.string().optional(),
    totalQuestions: z.string().optional(),

    batchStartDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .nullable(),

    CourseStatus: CourseStatusEnum.default(CourseStatus.UPCOMING),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
