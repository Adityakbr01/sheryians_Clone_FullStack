import z from "zod";


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

export const createCourseSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
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
    thumbnail: z.custom<File | null>((val) => val === null || val instanceof File, {
        message: 'Thumbnail must be a valid file'
    }).optional(),

    CourseLanguage: CourseLanguageEnum.default(CourseLanguage.HINGLISH),
    type: CourseTypeEnum.default(CourseType.LIVE),
    providesCertificate: z.boolean().optional().default(true),

    totalContentHours: z.string().optional(),
    totalLectures: z.string().optional(),
    totalQuestions: z.string().optional(),

    batchStartDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .nullable(),
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
