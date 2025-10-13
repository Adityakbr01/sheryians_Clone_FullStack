import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * API response type for course deletion
 */
interface DeleteCourseResponse {
    success: boolean;
    message: string;
}

/**
 * Hook for deleting a course
 */
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation<DeleteCourseResponse, Error, string>({
        mutationFn: async (courseId) => {
            if (!courseId) {
                throw new Error('Course ID is required for deletion');
            }

            const { data } = await api.delete<DeleteCourseResponse>(`/courses/${courseId}`);
            return data;
        },
        onSuccess: (_, courseId) => {
            // Invalidate and refetch courses list after deletion
            queryClient.invalidateQueries({
                queryKey: ['courses'],
            });

            // Remove this course from the cache
            queryClient.removeQueries({
                queryKey: ['course', courseId],
            });

            // Show success message
            toast.success('Course deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete course:', error);
        },
    });
}

export default useDeleteCourse;