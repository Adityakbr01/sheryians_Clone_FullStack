"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, FolderPlus } from "lucide-react";
import SyllabusAccordion from "./SyllabusAccordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ApiSection } from "@/types/syllabus";
import {
    useUpdateSyllabus,
    useCreateSection,
    useDeleteSection,
    useUpdateSection,
    useCreateTopic,
    useDeleteTopic,
    useUpdateTopic,
    useCreateSubtopic,
    useDeleteSubtopic,
    useUpdateSubtopic
} from "@/hooks/TanStack/mutations/courses/Syllabus";

// Define types for our component's syllabus structure
interface SubTopic {
    id: string;
    title: string;
    apiId?: string; // Reference to the API's _id field
}

interface Topic {
    id: string;
    title: string;
    subtopics: SubTopic[];
    apiId?: string; // Reference to the API's _id field
}

interface Section {
    id: string;
    section: string;
    topics: Topic[];
    apiId?: string; // Reference to the API's _id field
}

interface SyllabusEditorProps {
    syllabus?: Section[];
    onSave?: (syllabus: ApiSection[]) => void | Promise<void>;
    saving?: boolean;
    syllabusData: ApiSection[]; // This accepts the API format
    courseId: string; // Add course ID for direct API operations
}

// Transform API syllabus to Component format
function transformApiToComponentFormat(apiSyllabus: ApiSection[] = []): Section[] {
    console.log("===== TRANSFORMATION START: API TO COMPONENT =====");
    console.log("Raw API syllabus data to transform:", JSON.stringify(apiSyllabus, null, 2));
    console.log(`Found ${apiSyllabus.length} sections in API data`);

    if (apiSyllabus.length === 0) {
        console.log("No syllabus data to transform");
        return [];
    }

    try {
        const result = apiSyllabus.map((apiSection, sectionIndex) => {
            console.log(`\nProcessing section ${sectionIndex}: "${apiSection.title}" with _id: ${apiSection._id}`);
            console.log(`Section ${sectionIndex} has ${apiSection.topics?.length || 0} topics`);

            if (!apiSection.title) {
                console.warn(`Section ${sectionIndex} is missing a title, using default`);
                apiSection.title = "Untitled Section";
            }

            const transformedSection: Section = {
                id: `section-${sectionIndex}-${Date.now()}`,
                section: apiSection.title,
                apiId: apiSection._id, // Store the API's MongoDB ID
                // Initialize with empty array of the correct type
                topics: [] as Topic[]
            };

            // Safely process topics with error handling
            if (Array.isArray(apiSection.topics)) {
                const topics: Topic[] = apiSection.topics.map((apiTopic, topicIndex) => {
                    console.log(`  Processing topic ${topicIndex}: "${apiTopic.title}" with _id: ${apiTopic._id}`);
                    console.log(`  Topic ${topicIndex} has ${apiTopic.subTopics?.length || 0} subtopics`);

                    if (!apiTopic.title) {
                        console.warn(`Topic ${topicIndex} in section ${sectionIndex} is missing a title, using default`);
                        apiTopic.title = "Untitled Topic";
                    }

                    const transformedTopic: Topic = {
                        id: `topic-${sectionIndex}-${topicIndex}-${Date.now()}`,
                        title: apiTopic.title,
                        apiId: apiTopic._id, // Store the API's MongoDB ID
                        // Initialize with empty array of the correct type
                        subtopics: [] as SubTopic[]
                    };

                    // Safely process subtopics with error handling
                    if (Array.isArray(apiTopic.subTopics)) {
                        const subtopics: SubTopic[] = apiTopic.subTopics.map((apiSubtopic, subtopicIndex) => {
                            console.log(`    Processing subtopic ${subtopicIndex}: "${apiSubtopic.title}" with _id: ${apiSubtopic._id}`);

                            if (!apiSubtopic.title) {
                                console.warn(`Subtopic ${subtopicIndex} in topic ${topicIndex} in section ${sectionIndex} is missing a title, using default`);
                                apiSubtopic.title = "Untitled Subtopic";
                            }

                            return {
                                id: `subtopic-${sectionIndex}-${topicIndex}-${subtopicIndex}-${Date.now()}`,
                                title: apiSubtopic.title,
                                apiId: apiSubtopic._id // Store the API's MongoDB ID
                                // Array index is the key to API operations, not MongoDB ID
                            } as SubTopic;
                        });

                        transformedTopic.subtopics = subtopics;
                    } else {
                        console.warn(`Topic ${topicIndex} in section ${sectionIndex} has invalid or missing subTopics array`);
                        transformedTopic.subtopics = []; // Default to empty array if subTopics is not an array
                    }

                    console.log(`  Transformed topic has ${transformedTopic.subtopics.length} subtopics`);
                    return transformedTopic;
                });

                transformedSection.topics = topics;
            } else {
                console.warn(`Section ${sectionIndex} has invalid or missing topics array`);
                transformedSection.topics = []; // Ensure topics is always an array
            }

            console.log(`Transformed section has ${transformedSection.topics.length} topics`);
            return transformedSection;
        });

        console.log("===== TRANSFORMATION COMPLETE: API TO COMPONENT =====");
        console.log(`Transformed ${result.length} sections`);
        console.log("Final transformed structure:", JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error("Error during API to Component transformation:", error);
        console.trace("Stack trace for transformation error");
        return []; // Return empty array on error as fallback
    }
}

// Define interfaces for API format to avoid using 'any'
// Define recursive interface for subtopics that can have nested subtopics
interface ApiSubtopicData {
    title: string;
    subTopics: ApiSubtopicData[]; // Self-referential for deeper nesting
    _id?: string;    // Optional MongoDB ID
}

interface ApiTopicData {
    title: string;
    _id?: string;    // Optional MongoDB ID
    subTopics: ApiSubtopicData[];
}

interface ApiSectionData {
    title: string;
    _id?: string;    // Optional MongoDB ID
    topics: ApiTopicData[];
}

// Transform Component format back to API format
function transformComponentToApiFormat(componentSyllabus: Section[]): ApiSectionData[] {
    console.log("===== TRANSFORMATION START: COMPONENT TO API =====");
    console.log(`Transforming ${componentSyllabus.length} sections to API format`);

    try {
        if (!Array.isArray(componentSyllabus)) {
            console.error("componentSyllabus is not an array:", componentSyllabus);
            return [];
        }

        const result: ApiSectionData[] = componentSyllabus.map((section, sectionIndex) => {
            if (!section) {
                console.error(`Section at index ${sectionIndex} is undefined or null`);
                return {
                    title: "Error Section",
                    topics: []
                };
            }

            console.log(`\nProcessing section ${sectionIndex}: "${section.section}" with ${section.topics?.length || 0} topics`);

            // Include _id if we have apiId
            const sectionData: ApiSectionData = {
                title: section.section || "Untitled Section",
                topics: []
            };

            if (section.apiId) {
                sectionData._id = section.apiId;
                console.log(`  Section has API ID: ${section.apiId}`);
            } else {
                console.log("  Section has no API ID");
            }

            // Handle topics safely
            if (Array.isArray(section.topics)) {
                sectionData.topics = section.topics.map((topic, topicIndex) => {
                    if (!topic) {
                        console.error(`Topic at index ${topicIndex} in section ${sectionIndex} is undefined or null`);
                        return {
                            title: "Error Topic",
                            subTopics: []
                        };
                    }

                    console.log(`  Processing topic ${topicIndex}: "${topic.title}" with ${topic.subtopics?.length || 0} subtopics`);

                    const topicData: ApiTopicData = {
                        title: topic.title || "Untitled Topic",
                        subTopics: []
                    };

                    if (topic.apiId) {
                        topicData._id = topic.apiId;
                        console.log(`    Topic has API ID: ${topic.apiId}`);
                    } else {
                        console.log(`    Topic ${topicIndex} has no API ID`);
                    }

                    // Handle subtopics safely
                    if (Array.isArray(topic.subtopics)) {
                        topicData.subTopics = topic.subtopics.map((subtopic, subtopicIndex) => {
                            if (!subtopic) {
                                console.error(`Subtopic at index ${subtopicIndex} in topic ${topicIndex}, section ${sectionIndex} is undefined or null`);
                                return {
                                    title: "Error Subtopic",
                                    subTopics: []
                                };
                            }

                            console.log(`    Processing subtopic ${subtopicIndex}: "${subtopic.title}"`);

                            const subtopicData: ApiSubtopicData = {
                                title: subtopic.title || "Untitled Subtopic",
                                subTopics: [] // If needed for deeper nesting
                            };

                            if (subtopic.apiId) {
                                subtopicData._id = subtopic.apiId;
                                console.log(`      Subtopic has API ID: ${subtopic.apiId}`);
                            } else {
                                console.log(`      Subtopic ${subtopicIndex} has no API ID`);
                            }

                            return subtopicData;
                        });
                    } else {
                        console.warn(`Topic ${topicIndex} in section ${sectionIndex} has invalid or missing subtopics array`);
                    }

                    console.log(`  Transformed topic has ${topicData.subTopics.length} subtopics`);
                    return topicData;
                });
            } else {
                console.warn(`Section ${sectionIndex} has invalid or missing topics array`);
            }

            console.log(`Transformed section has ${sectionData.topics.length} topics`);
            return sectionData;
        });

        console.log("===== TRANSFORMATION COMPLETE: COMPONENT TO API =====");
        console.log(`Transformed to ${result.length} sections in API format`);
        console.log("Final API format structure validation:");

        // Final validation check
        result.forEach((section, i) => {
            console.log(`- Section ${i}: "${section.title}" has ${section.topics.length} topics`);
            section.topics.forEach((topic, j) => {
                console.log(`  - Topic ${j}: "${topic.title}" has ${topic.subTopics.length} subtopics`);
            });
        });

        return result;
    } catch (error) {
        console.error("Error during Component to API transformation:", error);
        console.trace("Stack trace for transformation error");
        return []; // Return empty array on error as fallback
    }
}

export default function SyllabusEditorNested({ onSave, saving: externalSaving = false, syllabusData, courseId }: SyllabusEditorProps) {
    // Transform API data to our component format
    const [syllabus, setSyllabus] = useState<Section[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<{
        sectionId: string;
        type: 'section' | 'topic' | 'subtopic';
        itemId?: string;
        subItemId?: string;
        title: string;
        sectionIndex?: number;
        topicIndex?: number;
        subtopicIndex?: number;
    } | null>(null);

    // Track which accordion items are open to maintain UX
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [openTopics, setOpenTopics] = useState<string[]>([]);

    // Status notification states
    const [feedback, setFeedback] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
        targetId?: string;
    }>({
        show: false,
        message: '',
        type: 'info',
        targetId: undefined
    });

    // Hook for directly updating the syllabus
    const updateSyllabusMutation = useUpdateSyllabus();
    const [isSaving, setIsSaving] = useState(false);

    // Combine external and internal saving states
    const saving = externalSaving || isSaving || updateSyllabusMutation.isPending;

    // Auto-hide feedback after delay
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (feedback.show) {
            timer = setTimeout(() => {
                setFeedback(prev => ({ ...prev, show: false }));
            }, 3000); // Hide after 3 seconds
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [feedback.show]);

    // Safe state updater function that ensures deep cloning
    const updateSyllabusState = (newSyllabus: Section[]) => {
        // Perform deep cloning to ensure we break all references
        const clonedSyllabus = JSON.parse(JSON.stringify(newSyllabus));

        // Validate the syllabus structure before updating state
        try {
            if (!Array.isArray(clonedSyllabus)) {
                throw new Error("Syllabus is not an array");
            }

            // Check that each section has expected structure
            clonedSyllabus.forEach((section: Section, i: number) => {
                if (!section) {
                    throw new Error(`Section ${i} is null or undefined`);
                }

                if (typeof section.section !== 'string') {
                    console.warn(`Section ${i} has invalid title: ${section.section}. Using default.`);
                    section.section = "Untitled Section";
                }

                if (!Array.isArray(section.topics)) {
                    console.warn(`Section ${i} has invalid topics array. Fixing.`);
                    section.topics = [] as Topic[];
                }

                section.topics.forEach((topic: Topic, j: number) => {
                    if (!topic) {
                        throw new Error(`Topic ${j} in section ${i} is null or undefined`);
                    }

                    if (typeof topic.title !== 'string') {
                        console.warn(`Topic ${j} in section ${i} has invalid title. Using default.`);
                        topic.title = "Untitled Topic";
                    }

                    if (!Array.isArray(topic.subtopics)) {
                        console.warn(`Topic ${j} in section ${i} has invalid subtopics array. Fixing.`);
                        topic.subtopics = [] as SubTopic[];
                    }

                    topic.subtopics.forEach((subtopic: SubTopic, k: number) => {
                        if (!subtopic) {
                            throw new Error(`Subtopic ${k} in topic ${j} in section ${i} is null or undefined`);
                        }

                        if (typeof subtopic.title !== 'string') {
                            console.warn(`Subtopic ${k} in topic ${j} in section ${i} has invalid title. Using default.`);
                            subtopic.title = "Untitled Subtopic";
                        }
                    });
                });
            });

            // If we got here, the structure is valid
            console.log("Syllabus structure validation passed");
            setSyllabus(clonedSyllabus);
        } catch (error) {
            console.error("Error in syllabus structure validation:", error);
            console.error("Invalid syllabus structure:", clonedSyllabus);
            // Don't update state with invalid data
            setFeedback({
                show: true,
                message: `Error updating syllabus: ${error instanceof Error ? error.message : 'Invalid structure'}`,
                type: 'error'
            });
        }
    };    // Debug syllabus state changes
    useEffect(() => {
        // Generate a short summary of the current syllabus structure
        if (syllabus.length > 0) {
            console.log("===== SYLLABUS STATE UPDATE =====");
            console.log(`Current syllabus has ${syllabus.length} sections:`);

            syllabus.forEach((section, i) => {
                console.log(`  Section ${i}: "${section.section}" has ${section.topics.length} topics, API ID: ${section.apiId || 'none'}`);

                section.topics.forEach((topic, j) => {
                    console.log(`    Topic ${j}: "${topic.title}" has ${topic.subtopics.length} subtopics, API ID: ${topic.apiId || 'none'}`);
                });
            });

            console.log("===== END SYLLABUS SUMMARY =====");
        }
    }, [syllabus]);

    // Transform API data to component format when syllabusData changes
    useEffect(() => {
        console.log("===== API DATA TRANSFORMATION TRIGGER =====");
        console.log("Raw syllabusData received:", JSON.stringify(syllabusData, null, 2));

        if (syllabusData && syllabusData.length > 0) {
            console.log(`Processing ${syllabusData.length} sections from API`);

            // Do a structure validation check before transformation
            let isDataValid = true;
            syllabusData.forEach((section, i) => {
                if (!section.title) {
                    console.error(`Section ${i} is missing a title`);
                    isDataValid = false;
                }
                if (!Array.isArray(section.topics)) {
                    console.error(`Section ${i} ("${section.title}") has invalid topics property, expected array`);
                    isDataValid = false;
                } else {
                    section.topics.forEach((topic, j) => {
                        if (!topic.title) {
                            console.error(`Topic ${j} in section ${i} is missing a title`);
                            isDataValid = false;
                        }
                        if (!Array.isArray(topic.subTopics)) {
                            console.error(`Topic ${j} ("${topic.title}") in section ${i} has invalid subTopics property, expected array`);
                            isDataValid = false;
                        }
                    });
                }
            });

            if (!isDataValid) {
                console.error("API data structure validation failed, see errors above");
            }

            const transformedData = transformApiToComponentFormat(syllabusData);
            console.log("Transformed component data structure:", JSON.stringify(transformedData, null, 2));

            // Verify transformation preserved the data structure
            if (transformedData.length !== syllabusData.length) {
                console.error(`Section count mismatch: API had ${syllabusData.length}, transformed has ${transformedData.length}`);
            }

            updateSyllabusState(transformedData);
            console.log("State updated with transformed data");
        } else {
            console.log("No syllabus data received, setting empty syllabus");
            updateSyllabusState([]);
        }
    }, [syllabusData]);


    // Handle editing of an item
    const handleEdit = (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => {
        // Find the item to edit
        let title = "";
        const sectionIndex = syllabus.findIndex(s => s.id === sectionId);
        const section = syllabus[sectionIndex];

        // Debug the section data
        console.log("Current syllabus:", syllabus);
        console.log("Editing section with ID:", sectionId, "and apiId:", section?.apiId);

        if (!section) return;

        // Keep the accordion open when editing
        if (!openSections.includes(sectionId)) {
            setOpenSections(prev => [...prev, sectionId]);
        }

        if (type === 'section') {
            title = section.section;
            console.log("Editing section:", title, "with index:", sectionIndex, "and apiId:", section.apiId);

            // Set currentItem directly for sections too
            setCurrentItem({
                sectionId,
                type,
                title,
                sectionIndex  // Make sure we set sectionIndex for sections
            });
            setEditDialogOpen(true);
            return;
        } else if (type === 'topic' && itemId) {
            const topicIndex = section.topics.findIndex(t => t.id === itemId);
            const topic = section.topics[topicIndex];
            if (topic) title = topic.title;

            // Keep the topic accordion open when editing
            if (!openTopics.includes(itemId)) {
                setOpenTopics(prev => [...prev, itemId]);
            }

            setCurrentItem({
                sectionId,
                type,
                itemId,
                title,
                sectionIndex,
                topicIndex
            });
            setEditDialogOpen(true);
            return;
        } else if (type === 'subtopic' && itemId && subItemId) {
            const topicIndex = section.topics.findIndex(t => t.id === itemId);
            const topic = section.topics[topicIndex];

            if (topic) {
                const subtopicIndex = topic.subtopics.findIndex(st => st.id === subItemId);
                const subtopic = topic.subtopics[subtopicIndex];

                if (subtopic) {
                    title = subtopic.title;

                    // Keep the topic accordion open when editing a subtopic
                    if (!openTopics.includes(itemId)) {
                        setOpenTopics(prev => [...prev, itemId]);
                    }

                    setCurrentItem({
                        sectionId,
                        type,
                        itemId,
                        subItemId,
                        title,
                        sectionIndex,
                        topicIndex,
                        subtopicIndex
                    });
                    setEditDialogOpen(true);
                    return;
                }
            }
        }

        // This code path should never execute if we've handled all cases properly above
        console.error("Unexpected code path in handleEdit - this should not happen");

        // Just in case, create a complete currentItem with all data
        setCurrentItem({
            sectionId,
            type,
            itemId,
            subItemId,
            title,
            sectionIndex
        });
        setEditDialogOpen(true);
    };

    // Handle deletion of an item
    const handleDelete = (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => {
        // Find the item to delete
        let title = "";
        const section = syllabus.find(s => s.id === sectionId);

        if (!section) return;

        if (type === 'section') {
            title = section.section;
        } else if (type === 'topic' && itemId) {
            const topic = section.topics.find(t => t.id === itemId);
            if (topic) title = topic.title;
        } else if (type === 'subtopic' && itemId && subItemId) {
            const topic = section.topics.find(t => t.id === itemId);
            if (topic) {
                const subtopic = topic.subtopics?.find(st => st.id === subItemId);
                if (subtopic) title = subtopic.title;
            }
        }

        setCurrentItem({ sectionId, type, itemId, subItemId, title });
        setDeleteDialogOpen(true);
    };

    // Initialize the mutation hooks
    const updateSectionMutation = useUpdateSection();
    const updateTopicMutation = useUpdateTopic();
    const updateSubtopicMutation = useUpdateSubtopic();

    // Save edited item
    const saveEditedItem = async () => {
        if (!currentItem) return;

        const { type, title, sectionIndex, topicIndex, subtopicIndex, sectionId } = currentItem;
        console.log("Saving edited item:", currentItem);
        console.log("Current syllabus state before update:", JSON.stringify(syllabus, null, 2));

        // Show immediate feedback that operation is in progress
        setFeedback({
            show: true,
            message: `Updating ${type}...`,
            type: 'info',
            targetId: type === 'section' ? sectionId : undefined
        });

        try {
            setIsSaving(true);
            setEditDialogOpen(false); // Auto-close dialog immediately for better UX

            // Create a deep clone of the entire syllabus to avoid reference issues
            const updatedSyllabus = JSON.parse(JSON.stringify(syllabus));

            if (type === 'section' && sectionIndex !== undefined) {
                console.log(`Before update, section ${sectionIndex} has title "${updatedSyllabus[sectionIndex].section}" and ${updatedSyllabus[sectionIndex].topics.length} topics`);

                // Make sure we create a fresh copy of the section without losing any data
                const originalSection = updatedSyllabus[sectionIndex];

                // Update ONLY the section title while preserving all other properties
                updatedSyllabus[sectionIndex] = {
                    ...originalSection, // Keep all original properties
                    section: title      // Update only the title
                };

                console.log(`After update, section ${sectionIndex} has title "${updatedSyllabus[sectionIndex].section}" and ${updatedSyllabus[sectionIndex].topics.length} topics`);

                // Verify topic preservation
                if (updatedSyllabus[sectionIndex].topics.length !== originalSection.topics.length) {
                    console.error("Critical error: Topics array length changed during update!");
                    updatedSyllabus[sectionIndex].topics = originalSection.topics;
                }

                // Update section in API - using index-based parameters
                if (sectionIndex !== undefined) {
                    console.log('Updating section in API:', {
                        courseId,
                        sectionId: sectionIndex.toString(),
                        sectionTitle: title
                    });

                    // Transform topics from component format to API format
                    // Component uses 'subtopics', API expects 'subTopics'
                    const apiTopics = updatedSyllabus[sectionIndex].topics.map((topic: Topic) => ({
                        title: topic.title,
                        _id: topic.apiId,
                        subTopics: topic.subtopics.map((subtopic: SubTopic) => ({
                            title: subtopic.title,
                            _id: subtopic.apiId,
                            subTopics: [] // For nested subtopics if needed
                        }))
                    }));

                    // Prepare the complete section data to send to API, including all nested content
                    const sectionToUpdate: Record<string, unknown> = {
                        title: title,
                        topics: apiTopics
                    };

                    if (originalSection.apiId) {
                        sectionToUpdate._id = originalSection.apiId;
                    }

                    console.log('Section data being sent to API:', JSON.stringify(sectionToUpdate, null, 2));

                    await updateSectionMutation.mutateAsync({
                        courseId,
                        sectionId: sectionIndex.toString(),
                        sectionTitle: title,
                        fullSection: sectionToUpdate // Send full section data
                    });

                    console.log('Section updated successfully');
                }

            } else if (type === 'topic' && sectionIndex !== undefined && topicIndex !== undefined) {
                // Get original topic object
                const originalTopic = updatedSyllabus[sectionIndex].topics[topicIndex];
                console.log(`Before update, topic has title "${originalTopic.title}" and ${originalTopic.subtopics.length} subtopics`);

                // Update ONLY the topic title while preserving all other properties
                updatedSyllabus[sectionIndex].topics[topicIndex] = {
                    ...originalTopic, // Keep all original properties 
                    title            // Update only the title
                };

                // Verify subtopics preservation
                if (updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.length !== originalTopic.subtopics.length) {
                    console.error("Critical error: Subtopics array length changed during update!");
                    updatedSyllabus[sectionIndex].topics[topicIndex].subtopics = originalTopic.subtopics;
                }

                console.log(`After update, topic has title "${updatedSyllabus[sectionIndex].topics[topicIndex].title}" and ${updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.length} subtopics`);

                // Update topic in API - need to use indices, not MongoDB IDs
                if (sectionIndex !== undefined && topicIndex !== undefined) {
                    try {
                        console.log('Updating topic in API:', {
                            courseId,
                            sectionId: sectionIndex.toString(),
                            topicId: topicIndex.toString(),
                            topicTitle: title
                        });

                        // Transform subtopics from component format to API format
                        const apiSubTopics = updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.map((subtopic: SubTopic) => ({
                            title: subtopic.title,
                            _id: subtopic.apiId,
                            subTopics: [] // For nested subtopics if needed
                        }));

                        // Prepare the complete topic data to send to API, including all nested content
                        const topicToUpdate: Record<string, unknown> = {
                            title: title,
                            subTopics: apiSubTopics
                        };

                        if (originalTopic.apiId) {
                            topicToUpdate._id = originalTopic.apiId;
                        }

                        console.log('Topic data being sent to API:', JSON.stringify(topicToUpdate, null, 2));

                        await updateTopicMutation.mutateAsync({
                            courseId,
                            sectionId: sectionIndex.toString(),
                            topicId: topicIndex.toString(),
                            topicTitle: title,
                            fullTopic: topicToUpdate // Send full topic data
                        });

                        console.log('Topic updated successfully');
                    } catch (error) {
                        // Rollback to previous state if API call fails
                        console.error('Failed to update topic in API:', error);
                        updatedSyllabus[sectionIndex].topics[topicIndex].title = syllabus[sectionIndex].topics[topicIndex].title;
                        updateSyllabusState(updatedSyllabus);
                        throw error;
                    }
                }
            } else if (type === 'subtopic' &&
                sectionIndex !== undefined &&
                topicIndex !== undefined &&
                subtopicIndex !== undefined) {
                // Get original subtopic object
                const originalSubtopic = updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex];
                console.log(`Before update, subtopic has title "${originalSubtopic.title}"`);

                // Update ONLY the subtopic title while preserving all other properties
                updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex] = {
                    ...originalSubtopic, // Keep all original properties
                    title               // Update only the title
                };

                console.log(`After update, subtopic has title "${updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex].title}"`);

                // Update subtopic in API - use indices
                try {
                    console.log('Updating subtopic in API:', {
                        courseId,
                        sectionId: sectionIndex.toString(),
                        topicId: topicIndex.toString(),
                        subtopicId: subtopicIndex.toString(),
                        subtopicTitle: title
                    });

                    // Prepare the complete subtopic data to send to API, including any nested content
                    const subtopicToUpdate: Record<string, unknown> = {
                        title: title,
                        subTopics: originalSubtopic.subTopics || [] // Preserve nested subtopics if any
                    };

                    if (originalSubtopic.apiId) {
                        subtopicToUpdate._id = originalSubtopic.apiId;
                    }

                    await updateSubtopicMutation.mutateAsync({
                        courseId,
                        sectionId: sectionIndex.toString(),
                        topicId: topicIndex.toString(),
                        subtopicId: subtopicIndex.toString(),
                        subtopicTitle: title,
                        fullSubtopic: subtopicToUpdate // Send full subtopic data
                    });

                    console.log('Subtopic updated successfully');
                } catch (error) {
                    // Rollback to previous state if API call fails
                    console.error('Failed to update subtopic in API:', error);
                    const oldTitle = syllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex].title;
                    updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex].title = oldTitle;
                    updateSyllabusState(updatedSyllabus);
                    throw error;
                }
            }

            console.log("Updated syllabus state after all changes:", JSON.stringify(updatedSyllabus, null, 2));
            updateSyllabusState(updatedSyllabus);

            // Show success feedback
            setFeedback({
                show: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} "${title}" updated successfully!`,
                type: 'success',
                targetId: currentItem.sectionId
            });
        } catch (error) {
            console.error('Error updating item:', error);

            // Show error feedback
            setFeedback({
                show: true,
                message: `Failed to update ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error',
                targetId: currentItem.sectionId
            });

            // Re-open dialog on error so user can try again
            setEditDialogOpen(true);
        } finally {
            setIsSaving(false);
            setCurrentItem(null);
        }
    };    // Initialize delete mutation hooks
    const deleteSectionMutation = useDeleteSection();
    const deleteTopicMutation = useDeleteTopic();
    const deleteSubtopicMutation = useDeleteSubtopic();

    // Delete item
    const confirmDelete = async () => {
        if (!currentItem) return;

        const { sectionId, type, itemId, subItemId } = currentItem;
        const itemTitle = currentItem.title; // Store title separately for logs and success message

        // Show immediate feedback that deletion is in progress
        setFeedback({
            show: true,
            message: `Deleting ${type} "${itemTitle}"...`,
            type: 'info',
            targetId: sectionId
        });

        // Close dialog immediately for better UX
        setDeleteDialogOpen(false);

        try {
            setIsSaving(true);
            const updatedSyllabus = [...syllabus];
            const sectionIndex = updatedSyllabus.findIndex(s => s.id === sectionId);

            if (sectionIndex === -1) {
                console.error('Section not found:', sectionId);
                return;
            }

            if (type === 'section') {
                // Delete section from API using index
                console.log('Deleting section from API:', {
                    courseId,
                    sectionId: sectionIndex.toString()
                });

                await deleteSectionMutation.mutateAsync({
                    courseId,
                    sectionId: sectionIndex.toString()
                });

                console.log('Section deleted successfully');

                // Update local state
                updateSyllabusState(updatedSyllabus.filter(s => s.id !== sectionId));

            } else if (type === 'topic' && itemId) {
                const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === itemId);

                if (topicIndex !== -1) {

                    // Save the topic for potential rollback
                    const deletedTopic = { ...updatedSyllabus[sectionIndex].topics[topicIndex] };
                    console.log('Preparing to delete topic:', deletedTopic);
                    console.log('Topic at index position:', topicIndex);

                    // Update local state immediately for optimistic update
                    updatedSyllabus[sectionIndex] = {
                        ...updatedSyllabus[sectionIndex],
                        topics: updatedSyllabus[sectionIndex].topics.filter(t => t.id !== itemId)
                    };
                    setSyllabus(updatedSyllabus);

                    // Delete topic from API using indices
                    try {
                        console.log('Deleting topic from API:', {
                            courseId,
                            sectionId: sectionIndex.toString(),
                            topicId: topicIndex.toString()
                        });

                        await deleteTopicMutation.mutateAsync({
                            courseId,
                            sectionId: sectionIndex.toString(),
                            topicId: topicIndex.toString()
                        });

                        console.log('Topic deleted successfully');
                    } catch (error) {
                        console.error('Error deleting topic from API:', error);

                        // Rollback the deletion if API call fails
                        console.log('Rolling back topic deletion due to API error');
                        const revertedSyllabus = [...updatedSyllabus];

                        // Insert the topic back at its original position if possible
                        if (topicIndex < revertedSyllabus[sectionIndex].topics.length) {
                            revertedSyllabus[sectionIndex].topics.splice(topicIndex, 0, deletedTopic);
                        } else {
                            revertedSyllabus[sectionIndex].topics.push(deletedTopic);
                        }

                        updateSyllabusState(revertedSyllabus);
                        throw error; // Re-throw to parent error handler
                    }
                } else {
                    console.error('Topic not found:', itemId);
                }

            } else if (type === 'subtopic' && itemId && subItemId) {
                const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === itemId);

                if (topicIndex !== -1 && updatedSyllabus[sectionIndex].topics[topicIndex].subtopics) {
                    const subtopicIndex = updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.findIndex(
                        st => st.id === subItemId
                    );

                    if (subtopicIndex !== -1) {
                        // Save the subtopic for potential rollback
                        const deletedSubtopic = {
                            ...updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex]
                        };
                        console.log('Preparing to delete subtopic:', deletedSubtopic);
                        console.log('Subtopic at index position:', subtopicIndex);

                        // Update local state first for optimistic update
                        updatedSyllabus[sectionIndex].topics[topicIndex] = {
                            ...updatedSyllabus[sectionIndex].topics[topicIndex],
                            subtopics: updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.filter(
                                st => st.id !== subItemId
                            )
                        };
                        setSyllabus(updatedSyllabus);

                        try {
                            // Delete subtopic from API using indices
                            console.log('Deleting subtopic from API:', {
                                courseId,
                                sectionId: sectionIndex.toString(),
                                topicId: topicIndex.toString(),
                                subtopicId: subtopicIndex.toString()
                            });

                            await deleteSubtopicMutation.mutateAsync({
                                courseId,
                                sectionId: sectionIndex.toString(),
                                topicId: topicIndex.toString(),
                                subtopicId: subtopicIndex.toString()
                            });

                            console.log('Subtopic deleted successfully');
                        } catch (error) {
                            console.error('Error deleting subtopic from API:', error);

                            // Rollback the deletion if API call fails
                            console.log('Rolling back subtopic deletion due to API error');

                            // Insert the subtopic back at its original position if possible
                            if (subtopicIndex < updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.length) {
                                updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.splice(subtopicIndex, 0, deletedSubtopic);
                            } else {
                                updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.push(deletedSubtopic);
                            }

                            setSyllabus([...updatedSyllabus]);
                            throw error; // Re-throw to parent error handler
                        }
                    } else {
                        console.error('Subtopic not found:', subItemId);
                    }
                } else {
                    console.error('Topic not found or has no subtopics:', itemId);
                }
            }
        } catch (error) {
            console.error('Error deleting item:', error);

            // Show error feedback
            setFeedback({
                show: true,
                message: `Failed to delete ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error',
                targetId: sectionId
            });

            // Re-open dialog on error so user can try again
            setDeleteDialogOpen(true);
        } finally {
            setIsSaving(false);
            setCurrentItem(null);

            // Show success feedback if no error occurred
            if (!deleteDialogOpen) {
                setFeedback({
                    show: true,
                    message: `${type.charAt(0).toUpperCase() + type.slice(1)} "${itemTitle}" deleted successfully!`,
                    type: 'success',
                    targetId: sectionId
                });
            }
        }
    };

    // Initialize create mutation hooks
    const createSectionMutation = useCreateSection();
    const createTopicMutation = useCreateTopic();
    const createSubtopicMutation = useCreateSubtopic();

    // Add new section
    const addSection = async () => {
        try {
            setIsSaving(true);
            console.log("Starting to add a new section");
            console.log("Current syllabus before adding section:", JSON.stringify(syllabus, null, 2));

            // Show feedback that section creation is in progress
            setFeedback({
                show: true,
                message: 'Adding new section...',
                type: 'info'
            });

            // Create a temporary section for immediate UI feedback
            const newSection: Section = {
                id: `section-${Date.now()}`,
                section: "New Section",
                topics: []
            };

            console.log("New section object:", newSection);

            // Update local state first for better UX
            const updatedSyllabus = [...syllabus, newSection];
            updateSyllabusState(updatedSyllabus);
            console.log("Local state updated with new section. Total sections:", updatedSyllabus.length);

            // Create section in the API
            console.log("Sending API request to create section:", {
                courseId,
                sectionTitle: "New Section"
            });

            const response = await createSectionMutation.mutateAsync({
                courseId,
                sectionTitle: "New Section"
            });

            console.log("API response for section creation:", response);

            // If API call was successful, update the section with the API ID
            if (response && response._id) {
                const updatedSyllabusWithApiId = [...updatedSyllabus];
                const lastIndex = updatedSyllabusWithApiId.length - 1;

                console.log("Updating section with API ID:", response._id, "at index:", lastIndex);

                updatedSyllabusWithApiId[lastIndex] = {
                    ...updatedSyllabusWithApiId[lastIndex],
                    apiId: response._id
                };

                updateSyllabusState(updatedSyllabusWithApiId);
                console.log("Final syllabus after API ID update:", JSON.stringify(updatedSyllabusWithApiId, null, 2));

                // Show success feedback
                setFeedback({
                    show: true,
                    message: 'New section added successfully!',
                    type: 'success',
                    targetId: updatedSyllabusWithApiId[lastIndex].id
                });
            } else {
                console.warn("API response missing _id field:", response);
            }
        } catch (error) {
            console.error('Error adding section:', error);

            // Show error feedback
            setFeedback({
                show: true,
                message: `Failed to add section: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error'
            });

            // Remove the temporary section if API call fails
            const currentSyllabus = [...syllabus];
            updateSyllabusState(currentSyllabus.slice(0, -1));
        } finally {
            setIsSaving(false);
        }
    };

    // Add new topic to a section
    const addTopic = async (sectionId: string) => {
        try {
            setIsSaving(true);
            console.log("Starting to add a new topic to section ID:", sectionId);

            // Show feedback that topic creation is in progress
            setFeedback({
                show: true,
                message: 'Adding new topic...',
                type: 'info',
                targetId: sectionId
            });

            const updatedSyllabus = JSON.parse(JSON.stringify(syllabus)); // Deep clone to avoid reference issues
            const sectionIndex = updatedSyllabus.findIndex((s: Section) => s.id === sectionId);

            if (sectionIndex === -1) {
                console.error("Section not found with ID:", sectionId);
                return;
            }

            console.log(`Found section at index ${sectionIndex}:`, updatedSyllabus[sectionIndex]);
            console.log(`Section currently has ${updatedSyllabus[sectionIndex].topics.length} topics`);

            // Generate a unique client-side ID for optimistic updates
            const tempId = `topic-${sectionIndex}-${Date.now()}`;

            // Create a temporary topic for immediate UI feedback
            const newTopic: Topic = {
                id: tempId,
                title: "New Topic",
                subtopics: []
            };

            console.log("New topic object:", newTopic);

            // Update local state for immediate feedback (optimistic update)
            updatedSyllabus[sectionIndex].topics.push(newTopic);
            console.log(`After adding, section now has ${updatedSyllabus[sectionIndex].topics.length} topics`);

            setSyllabus(updatedSyllabus);

            // Create topic in API using sectionIndex, not MongoDB ID
            try {
                console.log('Adding topic to API:', {
                    courseId,
                    sectionId: sectionIndex.toString(), // Using index instead of MongoDB ID
                    topicTitle: "New Topic"
                });

                const response = await createTopicMutation.mutateAsync({
                    courseId,
                    sectionId: sectionIndex.toString(), // Using index instead of MongoDB ID
                    topicTitle: "New Topic"
                });

                console.log("API response for topic creation:", response);

                // If API call was successful, update the topic with the API ID
                if (response && response._id) {
                    // Get updated syllabus again to avoid stale data
                    const refreshedSyllabus = JSON.parse(JSON.stringify(syllabus));
                    const topicIndex = refreshedSyllabus[sectionIndex].topics.findIndex((t: Topic) => t.id === tempId);

                    console.log(`Found topic at index ${topicIndex} in section ${sectionIndex}`);

                    if (topicIndex !== -1) {
                        refreshedSyllabus[sectionIndex].topics[topicIndex] = {
                            ...refreshedSyllabus[sectionIndex].topics[topicIndex],
                            apiId: response._id,
                            title: response.title || "New Topic" // Use API response title if available
                        };

                        console.log(`Updated topic with API ID ${response._id}:`,
                            refreshedSyllabus[sectionIndex].topics[topicIndex]);

                        setSyllabus(refreshedSyllabus);
                        console.log('Topic added successfully with ID:', response._id);

                        // Show success feedback
                        setFeedback({
                            show: true,
                            message: 'Topic added successfully!',
                            type: 'success',
                            targetId: sectionId
                        });
                    } else {
                        console.error("Topic not found with tempId:", tempId);
                    }
                } else {
                    console.warn("API response missing _id field:", response);
                }
            } catch (error) {
                console.error('Error adding topic to API:', error);

                // Remove the temporary topic if API call fails
                updatedSyllabus[sectionIndex].topics = updatedSyllabus[sectionIndex].topics.filter(
                    (t: Topic) => t.id !== tempId
                );
                updateSyllabusState([...updatedSyllabus]);

                // Show error feedback
                setFeedback({
                    show: true,
                    message: `Failed to add topic: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    type: 'error',
                    targetId: sectionId
                });
            }
        } catch (error) {
            console.error('Error adding topic:', error);

            // Show error feedback for unexpected errors
            setFeedback({
                show: true,
                message: 'Unexpected error while adding topic',
                type: 'error',
                targetId: sectionId
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Add new subtopic to a topic
    const addSubtopic = async (sectionId: string, topicId: string) => {
        try {
            setIsSaving(true);
            console.log("Starting to add a new subtopic to section ID:", sectionId, "topic ID:", topicId);

            // Show feedback that subtopic creation is in progress
            setFeedback({
                show: true,
                message: 'Adding new subtopic...',
                type: 'info',
                targetId: topicId
            });

            const updatedSyllabus = JSON.parse(JSON.stringify(syllabus)); // Deep clone to avoid reference issues
            const sectionIndex = updatedSyllabus.findIndex((s: Section) => s.id === sectionId);

            if (sectionIndex === -1) {
                console.error("Section not found with ID:", sectionId);
                return;
            }

            const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex((t: Topic) => t.id === topicId);

            if (topicIndex === -1) {
                console.error("Topic not found with ID:", topicId, "in section index:", sectionIndex);
                return;
            }

            console.log(`Found topic at index ${topicIndex} in section ${sectionIndex}:`,
                updatedSyllabus[sectionIndex].topics[topicIndex]);
            console.log(`Topic currently has ${updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.length} subtopics`);

            // Create a temporary subtopic for immediate UI feedback
            const newSubtopic: SubTopic = {
                id: `subtopic-${sectionIndex}-${topicIndex}-${Date.now()}`,
                title: "New Subtopic"
            };

            console.log("New subtopic object:", newSubtopic);

            // Update local state for immediate feedback
            updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.push(newSubtopic);
            console.log(`After adding, topic now has ${updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.length} subtopics`);

            setSyllabus(updatedSyllabus);

            // Create subtopic in API using indices, not MongoDB IDs
            try {
                console.log('Adding subtopic to API:', {
                    courseId,
                    sectionId: sectionIndex.toString(), // Using index instead of MongoDB ID
                    topicId: topicIndex.toString(),     // Using index instead of MongoDB ID
                    subtopicTitle: "New Subtopic"
                });

                const response = await createSubtopicMutation.mutateAsync({
                    courseId,
                    sectionId: sectionIndex.toString(), // Using index instead of MongoDB ID
                    topicId: topicIndex.toString(),     // Using index instead of MongoDB ID
                    subtopicTitle: "New Subtopic"
                });

                console.log("API response for subtopic creation:", response);

                // If API call was successful, update the subtopic with the API ID
                if (response && response._id) {
                    // Get updated syllabus again to avoid stale data
                    const refreshedSyllabus = JSON.parse(JSON.stringify(syllabus));
                    const subtopicIndex = refreshedSyllabus[sectionIndex].topics[topicIndex].subtopics.length - 1;

                    console.log(`Updating subtopic at index ${subtopicIndex} with API ID: ${response._id}`);

                    refreshedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex] = {
                        ...refreshedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex],
                        apiId: response._id,
                        title: response.title || "New Subtopic" // Use API response title if available
                    };

                    console.log("Updated subtopic:", refreshedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex]);

                    setSyllabus(refreshedSyllabus);
                    console.log('Subtopic added successfully with ID:', response._id);

                    // Show success feedback
                    setFeedback({
                        show: true,
                        message: 'Subtopic added successfully!',
                        type: 'success',
                        targetId: topicId
                    });
                } else {
                    console.warn("API response missing _id field:", response);
                }
            } catch (error) {
                console.error('Error adding subtopic to API:', error);

                // Remove the temporary subtopic if API call fails
                updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.pop();
                updateSyllabusState([...updatedSyllabus]);

                // Show error feedback
                setFeedback({
                    show: true,
                    message: `Failed to add subtopic: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    type: 'error',
                    targetId: topicId
                });
            }
        } catch (error) {
            console.error('Error adding subtopic:', error);

            // Show error feedback
            setFeedback({
                show: true,
                message: 'Unexpected error while adding subtopic',
                type: 'error',
                targetId: topicId
            });
        } finally {
            setIsSaving(false);
        }
    };
    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Show feedback that save is in progress
            setFeedback({
                show: true,
                message: 'Saving entire syllabus...',
                type: 'info'
            });

            // Transform component data back to API format before saving
            const apiFormattedSyllabus = transformComponentToApiFormat(syllabus);
            console.log("Saving syllabus to API:", apiFormattedSyllabus);

            // Use the updateSyllabusMutation for direct API updates
            await updateSyllabusMutation.mutateAsync({
                courseId,
                syllabus: apiFormattedSyllabus as unknown as ApiSection[]
            });

            // Also call the onSave prop if provided (for backward compatibility)
            if (onSave) {
                await onSave(apiFormattedSyllabus as unknown as ApiSection[]);
            }

            // Show success feedback
            setFeedback({
                show: true,
                message: 'Entire syllabus saved successfully!',
                type: 'success'
            });
        } catch (error) {
            console.error("Error saving syllabus:", error);

            // Show error feedback
            setFeedback({
                show: true,
                message: `Failed to save syllabus: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 relative">
            {/* Feedback notification */}
            {feedback.show && (
                <div
                    className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg animate-fadeIn transition-all transform duration-300 
                        ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-green-500' :
                            feedback.type === 'error' ? 'bg-red-100 text-red-800 border-red-500' :
                                'bg-blue-100 text-blue-800 border-blue-500'} 
                        border-l-4`}
                    style={{ maxWidth: '400px' }}
                >
                    <div className="flex items-center">
                        {feedback.type === 'success' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {feedback.type === 'error' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {feedback.type === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <p>{feedback.message}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Course Syllabus</h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={addSection}
                        className="flex cursor-pointer items-center gap-2 text-[#0e0e0e]"
                    >
                        <FolderPlus size={16} />
                        Add Section
                    </Button>
                    <Button variant={"ghost"} onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 cursor-pointer border border-[#1bd1a6] h-4 w-4 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Card className="border-none bg-transparent">
                <SyllabusAccordion
                    syllabus={syllabus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddTopic={addTopic}
                    onAddSubtopic={addSubtopic}
                    openSections={openSections}
                    onOpenSectionsChange={setOpenSections}
                    openTopics={openTopics}
                    onOpenTopicsChange={setOpenTopics}
                />

                {syllabus.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No syllabus content yet. Click &quot;Add Section&quot; to start building your course syllabus.
                    </div>
                )}
            </Card>

            {/* Edit dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit {currentItem?.type === 'section' ? 'Section' : currentItem?.type === 'topic' ? 'Topic' : 'Subtopic'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <Input
                            value={currentItem?.title || ''}
                            onChange={(e) => setCurrentItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                            placeholder="Enter title"
                            className="bg-transparent text-white"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveEditedItem}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        Are you sure you want to delete &quot;{currentItem?.title}&quot;?
                        {currentItem?.type === 'section' && (
                            <p className="text-red-400 mt-2">This will also delete all topics and subtopics in this section.</p>
                        )}
                        {currentItem?.type === 'topic' && (
                            <p className="text-red-400 mt-2">This will also delete all subtopics in this topic.</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}