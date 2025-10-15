// Export all syllabus-related hooks
import useUpdateSyllabus from './useUpdateSyllabus';

// Section hooks
import useCreateSection from './Section/useCreateSection';
import useDeleteSection from './Section/useDeleteSection';
import useUpdateSection from './Section/useUpdateSection';

// Topic hooks
import useCreateTopic from './Section/Topics/useCreateTopic';
import useDeleteTopic from './Section/Topics/useDeleteTopic';
import useUpdateTopic from './Section/Topics/useUpdateTopic';

// Subtopic hooks
import useCreateSubtopic from './Section/Topics/SubTopics/useCreateSubtopic';
import useDeleteSubtopic from './Section/Topics/SubTopics/useDeleteSubtopic';
import useUpdateSubtopic from './Section/Topics/SubTopics/useUpdateSubtopic';

export {
    // Main syllabus hook
    useUpdateSyllabus,

    // Section hooks
    useCreateSection,
    useDeleteSection,
    useUpdateSection,

    // Topic hooks
    useCreateTopic,
    useDeleteTopic,
    useUpdateTopic,

    // Subtopic hooks
    useCreateSubtopic,
    useDeleteSubtopic,
    useUpdateSubtopic
};