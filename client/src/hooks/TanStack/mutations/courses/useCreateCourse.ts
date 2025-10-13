import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * API response type for course creation
 */
interface CreateCourseResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        title: string;
        slug: string;
        description: string;
        instructor: string;
        price: number;
        originalPrice: number;
        category: string;
        tags: string[];
        type: 'Live Batch' | 'Self-Paced';
        thumbnail: string;
        providesCertificate: boolean;
        gst: boolean;
        language: string;
        schedule: string;
        batchStartDate: string;
        totalContentHours: string;
        totalLectures: string;
        totalQuestions: string;
        studentsEnrolled: number;
        createdAt: string;
        updatedAt: string;
        discountPercentage: number;
    };
}


export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation<CreateCourseResponse, Error, FormData>({
        mutationFn: async (courseData) => {
            console.log("Creating course with data:", courseData);
            const { data } = await api.post<CreateCourseResponse>('/courses', courseData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
}


export default useCreateCourse;
