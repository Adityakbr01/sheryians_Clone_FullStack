import { z } from "zod";

/**
 * Base schemas for syllabus components
 */
const subTopicSchema = z.object({
    title: z.string().min(1, "Subtopic title is required"),
    description: z.string().optional(),
    // Use any for nested structure to avoid recursive type issues
    subTopics: z.optional(z.array(z.any()))
});

const topicSchema = z.object({
    title: z.string().min(1, "Topic title is required"),
    description: z.string().optional(),
    subTopics: z.array(subTopicSchema).optional()
});

const sectionSchema = z.object({
    title: z.string().min(1, "Section title is required"),
    description: z.string().optional(),
    topics: z.array(topicSchema).min(1, "At least one topic is required")
});

/**
 * Main operation schemas
 */
export const syllabusSchema = z.object({
    syllabus: z.array(sectionSchema).min(1, "At least one section is required")
});

export const updateSyllabusSchema = syllabusSchema;

/**
 * Component operation schemas
 */
export const syllabusValidation = {
    // Base schemas for reuse
    section: sectionSchema,
    topic: topicSchema,
    subtopic: subTopicSchema,

    // Creation and update validation
    createSection: z.object({
        title: sectionSchema.shape.title,
        topics: z.optional(z.array(topicSchema))
    }),

    updateSection: z.object({
        title: z.optional(sectionSchema.shape.title),
        topics: z.optional(z.array(topicSchema)),
        params: z.object({
            sectionIndex: z.string().min(1, "Section index is required")
        })
    }),

    createTopic: z.object({
        title: topicSchema.shape.title,
        subTopics: z.optional(z.array(subTopicSchema)),
    }),

    updateTopic: z.object({
        title: z.optional(topicSchema.shape.title),
        subTopics: z.optional(z.array(subTopicSchema)),
    }),

    createSubtopic: z.object({
        title: subTopicSchema.shape.title,
        subTopics: z.optional(z.array(subTopicSchema))
    }),

    updateSubtopic: z.object({
        title: z.optional(subTopicSchema.shape.title),
        subTopics: z.optional(z.array(subTopicSchema))
    })
};

// Export types for TypeScript usage
export type SyllabusInput = z.infer<typeof syllabusSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type SubtopicInput = z.infer<typeof subTopicSchema>;