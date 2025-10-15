import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface Topic {
    title: string;
}

interface UpdateTopicParams {
    courseId: string;
    sectionIndex: number;
    topicIndex: number;
    topic: Topic;
}

export const useUpdateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topicIndex, topic }: UpdateTopicParams) => {
            const { data } = await api.put(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic/${topicIndex}`,
                topic
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Topic updated successfully');
        },

        onError: (error: Error) => {
            console.error('Error updating topic:', error);
            toast.error('Failed to update topic');
        },
    });
};

export default useUpdateTopic;