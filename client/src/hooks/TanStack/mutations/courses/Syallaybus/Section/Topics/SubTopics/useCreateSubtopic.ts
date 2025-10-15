import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface SubTopic {
    title: string;
}

interface AddSubtopicParams {
    courseId: string;
    sectionIndex: number;
    topicIndex: number;
    subtopic: SubTopic;
}

export const useAddSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topicIndex, subtopic }: AddSubtopicParams) => {
            const { data } = await api.post(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic/${topicIndex}/subtopic`,
                subtopic
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Subtopic added successfully');
        },

        onError: (error: Error) => {
            console.error('Error adding subtopic:', error);
            toast.error('Failed to add subtopic');
        },
    });
};

export default useAddSubtopic;