import { Course } from '@/types/course';
import api from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * API response type for fetching a single course
 */
interface GetCourseResponse {
    success: boolean;
    message: string;
    data: Course;
}

/**
 * Hook for fetching a single course by ID
 */
export function useGetCourseById(courseId: string | undefined) {
    return useQuery<GetCourseResponse, Error>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            if (!courseId) {
                throw new Error('Course ID is required');
            }

            const { data } = await api.get<GetCourseResponse>(`/courses/${courseId}`);
            return data;
        },
        enabled: Boolean(courseId), // Only fetch when courseId is provided
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
}

export default useGetCourseById;