export interface CreateCourseFormValues {
    title: string;
    description: string;
    originalPrice: number;
    category: string;
    subTag?: string;
    offer?: string;
    gst: boolean;
    providesCertificate: boolean;
    CourseLanguage: string; // or enum CourseLanguage
    type: string; // or enum CourseType
    tags?: string[];
    discountPercentage: number;
}
