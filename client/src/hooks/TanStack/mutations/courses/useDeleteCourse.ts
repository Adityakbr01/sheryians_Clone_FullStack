import api from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteCourseResponse {
    success: boolean;
    message: string;
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation<DeleteCourseResponse, Error, string>({
        mutationFn: async (courseId) => {
            if (!courseId) throw new Error('Course ID is required');
            const { data } = await api.delete<DeleteCourseResponse>(`/courses/${courseId}`);
            return data;
        },
        onSuccess: (_, courseId) => {
            // Refresh the courses list
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            // Optionally remove individual course cache
            queryClient.removeQueries({ queryKey: ['course', courseId] });
        },
    });
}

export default useDeleteCourse;
