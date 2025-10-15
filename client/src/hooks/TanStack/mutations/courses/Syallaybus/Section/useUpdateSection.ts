import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

interface Section {
    title: string;
}

interface UpdateSectionParams {
    courseId: string;
    sectionIndex: number;
    section: Section;
}

export const useUpdateSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionIndex, section }: UpdateSectionParams) => {
            const { data } = await api.put(
                `/syllabus/course/${courseId}/section/${sectionIndex}`,
                section
            );
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Section updated successfully');
        },

        onError: (error: Error) => {
            console.error('Error updating section:', error);
            toast.error('Failed to update section');
        },
    });
};

export default useUpdateSection;