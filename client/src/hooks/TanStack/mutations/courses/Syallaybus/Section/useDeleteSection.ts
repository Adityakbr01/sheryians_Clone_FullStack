import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface DeleteSectionParams {
    courseId: string;
    sectionIndex: number;
}

export const useDeleteSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex }: DeleteSectionParams) => {
            const { data } = await api.delete(`/syllabus/course/${courseId}/section/${sectionIndex}`);
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Section deleted successfully');
        },

        onError: (error: Error) => {
            console.error('Error deleting section:', error);
            toast.error('Failed to delete section');
        },
    });
};

export default useDeleteSection;