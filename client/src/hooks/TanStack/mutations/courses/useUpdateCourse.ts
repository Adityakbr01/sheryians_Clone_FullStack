import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * API response type for course update
 */
interface UpdateCourseResponse {
    success: boolean;
    message: string;
    courseId?: string;
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
    const queryClient = useQueryClient();

    return useMutation<UpdateCourseResponse, Error, FormData>({
        mutationFn: async (courseData) => {
            const courseId = courseData.get('_id') as string;
            if (!courseId) {
                throw new Error('Course ID is required for updating a course');
            }

            const { data } = await api.put<UpdateCourseResponse>(
                `/courses/${courseId}`,
                courseData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log("UpdateCourse Response Data:", data);

            // ✅ return both data and courseId so onSuccess can access it
            return { ...data, courseId };
        },
        onSuccess: (data) => {
            // now we can use data.courseId safely
            queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
        },
    });
}

export default useUpdateCourse;
