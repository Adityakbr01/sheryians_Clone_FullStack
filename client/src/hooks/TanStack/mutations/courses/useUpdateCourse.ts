import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * API response type for course update
 */
interface UpdateCourseResponse {
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

/**
 * Hook for updating an existing course
 */
function useUpdateCourse() {
    const queryClient = useQueryClient(); // 👈 Get query client

    return useMutation<UpdateCourseResponse, Error, FormData>({
        mutationFn: async (courseData) => {
            const courseId = courseData.get('_id');
            if (!courseId) {
                throw new Error('Course ID is required for updating a course');
            }
            const { data } = await api.put<UpdateCourseResponse>(
                `/courses/${courseId}`,
                courseData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] }); // 🔥 Invalidate courses
        },
    });
}

export default useUpdateCourse;