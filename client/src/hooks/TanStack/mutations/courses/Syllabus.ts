import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";
import { Section, Topic, SubTopic } from "@/types/course";

// Types for mutation parameters
export interface UpdateSyllabusParams {
    courseId: string;
    syllabus: Section[];
}

export interface CreateSectionParams {
    courseId: string;
    sectionTitle: string;
}

// Make sure these parameter names match the API requirements
export interface UpdateSectionParams {
    courseId: string;
    sectionId: string; // This should be the MongoDB _id
    sectionTitle: string;
    fullSection?: Partial<Section>; // Full section data to preserve structure
}

export interface DeleteSectionParams {
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
    fullTopic?: Partial<Topic>; // Full topic data to preserve structure
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
    fullSubtopic?: Partial<SubTopic>; // Full subtopic data to preserve structure
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
            console.log('Creating section:', courseId, sectionTitle);
            const response = await axios.post(`/syllabus/course/${courseId}/section`, {
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
        mutationFn: async ({ courseId, sectionId, sectionTitle, fullSection }: UpdateSectionParams) => {
            // The backend expects a sectionIndex, not a MongoDB ID!
            // We need to convert this to an index or modify the backend
            // For now, we'll assume sectionId is actually the index
            const sectionIndex = sectionId;

            const url = `/syllabus/course/${courseId}/section/${sectionIndex}`;
            console.log("UPDATE SECTION - Full URL:", url);

            // If fullSection is provided, use it with title update
            // Otherwise just send the title update
            const requestData = fullSection ?
                { ...fullSection, title: sectionTitle } :
                { title: sectionTitle };

            console.log("UPDATE SECTION - Request payload:", requestData);

            // Using the correct API endpoint format with index instead of ID
            const response = await axios.put(url, requestData);
            console.log("UPDATE SECTION - Response:", response.data);
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
            // sectionId is actually the index in the array
            console.log("Deleting section at index:", sectionId);
            const response = await axios.delete(`/syllabus/course/${courseId}/section/${sectionId}`);
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
            console.log("Creating topic with section index:", sectionId);

            // Using the correct API endpoint format with section index
            const response = await axios.post(`/syllabus/course/${courseId}/section/${sectionId}/topic`, {
                title: topicTitle
            });
            console.log("Create topic response:", response.data);
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
        mutationFn: async ({ courseId, sectionId, topicId, topicTitle, fullTopic }: UpdateTopicParams) => {
            // We need to use indices, not MongoDB IDs
            console.log(`Updating topic - section index: ${sectionId}, topic index: ${topicId}`);

            // If fullTopic is provided, use it with title update
            // Otherwise just send the title update
            const requestData = fullTopic ?
                { ...fullTopic, title: topicTitle } :
                { title: topicTitle };

            console.log("UPDATE TOPIC - Request payload:", requestData);

            const response = await axios.put(
                `/syllabus/course/${courseId}/section/${sectionId}/topic/${topicId}`,
                requestData
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
            // Using indices, not MongoDB IDs
            console.log(`Deleting topic - section index: ${sectionId}, topic index: ${topicId}`);

            const response = await axios.delete(
                `/syllabus/course/${courseId}/section/${sectionId}/topic/${topicId}`
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
            console.log("Creating subtopic with indices:", {
                sectionIndex: sectionId,
                topicIndex: topicId
            });

            // Using the correct API endpoint format with section and topic indices
            const response = await axios.post(
                `/syllabus/course/${courseId}/section/${sectionId}/topic/${topicId}/subtopic`,
                { title: subtopicTitle }
            );
            console.log("Create subtopic response:", response.data);
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
        mutationFn: async ({ courseId, sectionId, topicId, subtopicId, subtopicTitle, fullSubtopic }: UpdateSubtopicParams) => {
            // Using indices, not MongoDB IDs
            console.log(`Updating subtopic - section index: ${sectionId}, topic index: ${topicId}, subtopic index: ${subtopicId}`);

            // If fullSubtopic is provided, use it with title update
            // Otherwise just send the title update
            const requestData = fullSubtopic ?
                { ...fullSubtopic, title: subtopicTitle } :
                { title: subtopicTitle };

            console.log("UPDATE SUBTOPIC - Request payload:", requestData);

            const response = await axios.put(
                `/syllabus/course/${courseId}/section/${sectionId}/topic/${topicId}/subtopic/${subtopicId}`,
                requestData
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
            // Using indices, not MongoDB IDs
            console.log(`Deleting subtopic - section index: ${sectionId}, topic index: ${topicId}, subtopic index: ${subtopicId}`);

            const response = await axios.delete(
                `/syllabus/course/${courseId}/section/${sectionId}/topic/${topicId}/subtopic/${subtopicId}`
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["course-syllabus", variables.courseId] });
        },
    });
};