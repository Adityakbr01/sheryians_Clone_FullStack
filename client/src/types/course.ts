// Syllabus interfaces
export interface SubTopic {
    _id: string;
    title: string;
    subTopics?: SubTopic[]; // For potential nested subtopics
}

export interface Topic {
    _id: string;
    title: string;
    subTopics?: SubTopic[];
}

export interface Section {
    _id: string;
    title: string;
    topics: Topic[];
}

export interface Course {
    _id: string;
    title: string;
    slug: string;
    description: string;
    instructor?: string;

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

    // Syllabus structure
    CourseSyllabusSchema?: {
        syllabus: Section[];
    }
}
