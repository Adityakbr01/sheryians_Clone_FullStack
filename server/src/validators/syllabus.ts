import { z } from "zod";

/**
 * Due to the complexity of recursive types in Zod, we'll use a simpler approach
 * to validate the syllabus structure.
 */

// Basic subtopic schema
const subTopicSchema = z.object({
    title: z.string().min(1, "Subtopic title is required"),
    // Use any for the nested structure to avoid recursive type issues
    subTopics: z.optional(z.array(z.any()))
});

// Topic schema
const topicSchema = z.object({
    title: z.string().min(1, "Topic title is required"),
    subTopics: z.array(subTopicSchema).optional()
});

// Section schema
const sectionSchema = z.object({
    title: z.string().min(1, "Section title is required"),
    topics: z.array(topicSchema).min(1, "At least one topic is required")
});

// Complete syllabus schema
export const syllabusSchema = z.object({
    syllabus: z.array(sectionSchema).min(1, "At least one section is required")
});

// Schema for updating a syllabus
export const updateSyllabusSchema = syllabusSchema;

// Export type from schemas
export type SyllabusInput = z.infer<typeof syllabusSchema>;