import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface Topic {
    title: string;
    subTopics?: { title: string }[];
}

interface AddTopicParams {
    courseId: string;
    sectionIndex: number;
    topic: Topic;
}

export const useAddTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topic }: AddTopicParams) => {
            const { data } = await api.post(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic`,
                topic
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Topic added successfully');
        },

        onError: (error: Error) => {
            console.error('Error adding topic:', error);
            toast.error('Failed to add topic');
        },
    });
};

export default useAddTopic;