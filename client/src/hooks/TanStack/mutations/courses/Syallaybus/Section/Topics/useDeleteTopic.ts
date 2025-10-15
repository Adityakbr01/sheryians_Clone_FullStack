import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface DeleteTopicParams {
    courseId: string;
    sectionIndex: number;
    topicIndex: number;
}

export const useDeleteTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topicIndex }: DeleteTopicParams) => {
            const { data } = await api.delete(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic/${topicIndex}`
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Topic deleted successfully');
        },

        onError: (error: Error) => {
            console.error('Error deleting topic:', error);
            toast.error('Failed to delete topic');
        },
    });
};

export default useDeleteTopic;