import { CourseFormData } from '@/types/course';
import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * API response type for course creation
 */
interface CreateCourseResponse {
    success: boolean;
    message: string;
    data: {
        course: {
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
        }
    };
}

/**
 * Hook for creating a new course
 */
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation<CreateCourseResponse, Error, CourseFormData>({
        mutationFn: async (courseData) => {
            // If a file is being uploaded for thumbnail, you'd use FormData
            // For now, we're assuming thumbnail is a URL string
            const { data } = await api.post<CreateCourseResponse>('/courses', courseData);
            return data;
        },
        onSuccess: (data) => {
            // Invalidate courses list query to trigger a refetch
            queryClient.invalidateQueries({
                queryKey: ['courses'],
            });

            // Show success message
            toast.success(`Course "${data.data.course.title}" created successfully!`);
        },
        onError: (error) => {
            // Error handling is already managed by the axios interceptor
            // But we can add more specific error handling here if needed
            console.error('Failed to create course:', error);
        },
    });
}

export default useCreateCourse;
