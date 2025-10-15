import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface SubTopic {
    title: string;
}

interface UpdateSubtopicParams {
    courseId: string;
    sectionIndex: number;
    topicIndex: number;
    subtopicIndex: number;
    subtopic: SubTopic;
}

export const useUpdateSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, topicIndex, subtopicIndex, subtopic }: UpdateSubtopicParams) => {
            const { data } = await api.put(
                `/syllabus/course/${courseId}/section/${sectionIndex}/topic/${topicIndex}/subtopic/${subtopicIndex}`,
                subtopic
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Subtopic updated successfully');
        },

        onError: (error: Error) => {
            console.error('Error updating subtopic:', error);
            toast.error('Failed to update subtopic');
        },
    });
};

export default useUpdateSubtopic;