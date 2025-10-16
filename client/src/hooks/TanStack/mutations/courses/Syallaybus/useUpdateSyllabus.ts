import api from '@/api/axios';
import { Section } from '@/types/course';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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

        onError: (error: unknown) => {
            console.error('Error updating syllabus:', error);
            const message = error instanceof AxiosError && error.response?.data?.message
                ? error.response.data.message
                : 'Failed to update syllabus. Please try again.';
            toast.error(message);
        },
    });
};

export default useUpdateSyllabus;