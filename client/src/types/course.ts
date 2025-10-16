// Syllabus interfaces
export interface SubTopic {
    _id: string;
    title: string;
    subTopics?: SubTopic[];
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
    type: string;
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

    //Course status
    CourseStatus: string; // Using string type to be compatible with CourseStatusEnum values

    // Syllabus structure
    CourseSyllabusSchema: {
        _id: string;
        courseId: string;
        createdAt: string;
        updatedAt: string;
        Sections: Section[];
    }
}


