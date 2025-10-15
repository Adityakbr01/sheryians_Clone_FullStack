import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { Section } from '@/types/course';
import toast from 'react-hot-toast';

interface UpdateSyllabusParams {
    courseId: string;
    syllabus: Section[];
}

export const useUpdateSyllabus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, syllabus }: UpdateSyllabusParams) => {
            const payload = {
                courseId,
                syllabus
            };

            const { data } = await api.put(`/syllabus/course/${courseId}`, payload);
            return data;
        },

        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['syllabus', variables.courseId] });
            toast.success('Syllabus updated successfully');
        },

        onError: (error: any) => {
            console.error('Error updating syllabus:', error);
            toast.error(error?.response?.data?.message || 'Failed to update syllabus');
        },
    });
};

export default useUpdateSyllabus;