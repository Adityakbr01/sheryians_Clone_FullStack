import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface DeleteSubtopicParams {
    courseId: string;
    sectionIndex: number;
    topicIndex: number;
    subtopicIndex: number;
}

export const useDeleteSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topicIndex, subtopicIndex }: DeleteSubtopicParams) => {
            const { data } = await api.delete(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic/${topicIndex}/subtopic/${subtopicIndex}`
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Subtopic deleted successfully');
        },

        onError: (error: Error) => {
            console.error('Error deleting subtopic:', error);
            toast.error('Failed to delete subtopic');
        },
    });
};

export default useDeleteSubtopic;