import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";
import { Section } from "@/types/course";

// Types for mutation parameters
export interface UpdateSyllabusParams {
    courseId: string;
    syllabus: Section[];
}

export interface CreateSectionParams {
    courseId: string;
    sectionTitle: string;
}

export interface UpdateSectionParams {
    courseId: string;
    sectionId: string;  // This is the MongoDB _id of the section
    sectionTitle: string;
}export interface DeleteSectionParams {
    courseId: string;
    sectionId: string;
}

export interface CreateTopicParams {
    courseId: string;
    sectionId: string;
    topicTitle: string;
}

export interface UpdateTopicParams {
    courseId: string;
    sectionId: string;
    topicId: string;
    topicTitle: string;
}

export interface DeleteTopicParams {
    courseId: string;
    sectionId: string;
    topicId: string;
}

export interface CreateSubtopicParams {
    courseId: string;
    sectionId: string;
    topicId: string;
    subtopicTitle: string;
}

export interface UpdateSubtopicParams {
    courseId: string;
    sectionId: string;
    topicId: string;
    subtopicId: string;
    subtopicTitle: string;
}

export interface DeleteSubtopicParams {
    courseId: string;
    sectionId: string;
    topicId: string;
    subtopicId: string;
}

// Update entire syllabus
export const useUpdateSyllabus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, syllabus }: UpdateSyllabusParams) => {
            const response = await axios.put(`/api/courses/${courseId}/syllabus`, { syllabus });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Create a new section
export const useCreateSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionTitle }: CreateSectionParams) => {
            const response = await axios.post(`/api/courses/${courseId}/syllabus/sections`, {
                title: sectionTitle
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Update an existing section
export const useUpdateSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, sectionTitle }: UpdateSectionParams) => {
            // The sectionId param is the MongoDB _id of the section to update
            const response = await axios.put(`/api/courses/${courseId}/syllabus/sections/${sectionId}`, {
                title: sectionTitle
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};// Delete a section
export const useDeleteSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId }: DeleteSectionParams) => {
            const response = await axios.delete(`/api/courses/${courseId}/syllabus/sections/${sectionId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Create a new topic
export const useCreateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicTitle }: CreateTopicParams) => {
            const response = await axios.post(`/api/courses/${courseId}/syllabus/sections/${sectionId}/topics`, {
                title: topicTitle
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Update an existing topic
export const useUpdateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicId, topicTitle }: UpdateTopicParams) => {
            const response = await axios.put(
                `/api/courses/${courseId}/syllabus/sections/${sectionId}/topics/${topicId}`,
                { title: topicTitle }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Delete a topic
export const useDeleteTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicId }: DeleteTopicParams) => {
            const response = await axios.delete(
                `/api/courses/${courseId}/syllabus/sections/${sectionId}/topics/${topicId}`
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Create a new subtopic
export const useCreateSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicId, subtopicTitle }: CreateSubtopicParams) => {
            const response = await axios.post(
                `/api/courses/${courseId}/syllabus/sections/${sectionId}/topics/${topicId}/subtopics`,
                { title: subtopicTitle }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Update an existing subtopic
export const useUpdateSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicId, subtopicId, subtopicTitle }: UpdateSubtopicParams) => {
            const response = await axios.put(
                `/api/courses/${courseId}/syllabus/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`,
                { title: subtopicTitle }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};

// Delete a subtopic
export const useDeleteSubtopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, sectionId, topicId, subtopicId }: DeleteSubtopicParams) => {
            const response = await axios.delete(
                `/api/courses/${courseId}/syllabus/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};