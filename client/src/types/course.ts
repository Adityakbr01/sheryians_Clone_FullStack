export interface Course {
    _id: string;
    title: string;
    slug: string;
    description: string;
    instructor: string;

    price: number;
    originalPrice: number;
    discountPercentage: number

    category: string;
    tags: string[];
    subTag: string
    offer: string
    type: 'Live Batch' | 'Recorded' | 'Hybrid';
    thumbnail: string;
    providesCertificate?: boolean;
    gst: boolean;
    CourseLanguage: string;
    schedule?: string;
    batchStartDate?: string;
    totalContentHours?: string;
    totalLectures?: string;
    totalQuestions?: string;
    studentsEnrolled?: number;
    createdAt?: string;
}

export interface CourseFormData extends Omit<Course, 'id' | 'studentsEnrolled' | 'createdAt'> {
    id?: string;
    studentsEnrolled?: number;
    createdAt?: string;
}

export type CourseFormErrors = Partial<Record<keyof CourseFormData, string>>;