import { Course } from '@/types/course';
import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * API response type for course update
 */
interface UpdateCourseResponse {
    success: boolean;
    message: string;
    data: {
        course: Course;
    };
}

/**
 * Hook for updating an existing course
 */
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation<UpdateCourseResponse, Error, Course>({
        mutationFn: async (courseData) => {
            const courseId = courseData._id;
            if (!courseId) {
                throw new Error('Course ID is required for updating a course');
            }

            const { data } = await api.put<UpdateCourseResponse>(`/courses/${courseId}`, courseData);
            return data;
        },
        onSuccess: (data) => {
            // Invalidate courses list query to trigger a refetch
            queryClient.invalidateQueries({
                queryKey: ['courses'],
            });

            // Also invalidate the individual course query
            queryClient.invalidateQueries({
                queryKey: ['course', data.data.course._id],
            });

            // Show success message
            toast.success(`Course "${data.data.course.title}" updated successfully!`);
        },
        onError: (error) => {
            console.error('Failed to update course:', error);
        },
    });
}

export default useUpdateCourse;