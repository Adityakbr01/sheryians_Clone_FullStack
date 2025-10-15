import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface Section {
    title: string;
    topics?: { title: string; subTopics?: { title: string }[] }[];
}

interface AddSectionParams {
    courseId: string;
    section: Section;
}

export const useAddSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, section }: AddSectionParams) => {
            const { data } = await api.post(`/syllabus/course/${courseId}/section`, section);
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Section added successfully');
        },

        onError: (error: Error) => {
            console.error('Error adding section:', error);
            toast.error('Failed to add section');
        },
    });
};

export default useAddSection;