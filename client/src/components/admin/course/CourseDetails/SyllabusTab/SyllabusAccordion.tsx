"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { FileText, Folder, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubTopic {
    id: string;
    title: string;
    apiId?: string;
}

interface Topic {
    id: string;
    title: string;
    subtopics: SubTopic[];
    apiId?: string;
}

interface Section {
    id: string;
    section: string;
    topics: Topic[];
    apiId?: string;
}

interface SyllabusAccordionProps {
    syllabus: Section[];
    onEdit?: (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => void;
    onDelete?: (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => void;
    onAddTopic?: (sectionId: string) => void;
    onAddSubtopic?: (sectionId: string, topicId: string) => void;
    openSections?: string[];
    onOpenSectionsChange?: (sections: string[]) => void;
    openTopics?: string[];
    onOpenTopicsChange?: (topics: string[]) => void;
}

export default function SyllabusAccordion({
    syllabus,
    onEdit,
    onDelete,
    onAddTopic,
    onAddSubtopic,
    openSections,
    onOpenSectionsChange,
    openTopics,
    onOpenTopicsChange
}: SyllabusAccordionProps) {
    return (
        <div className="space-y-4">
            <Accordion
                type="multiple"
                className="w-full"
                value={openSections}
                onValueChange={onOpenSectionsChange}
            >
                {syllabus.map((section) => (
                    <SectionItem
                        key={section.id}
                        section={section}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddTopic={onAddTopic}
                        onAddSubtopic={onAddSubtopic}
                        openTopics={openTopics}
                        onOpenTopicsChange={onOpenTopicsChange}
                    />
                ))}
            </Accordion>
        </div>
    );
}

function SectionItem({
    section,
    onEdit,
    onDelete,
    onAddTopic,
    onAddSubtopic,
    openTopics,
    onOpenTopicsChange
}: {
    section: Section,
    onEdit?: SyllabusAccordionProps['onEdit'],
    onDelete?: SyllabusAccordionProps['onDelete'],
    onAddTopic?: SyllabusAccordionProps['onAddTopic'],
    onAddSubtopic?: SyllabusAccordionProps['onAddSubtopic'],
    openTopics?: string[],
    onOpenTopicsChange?: (topics: string[]) => void
}) {
    return (
        <AccordionItem value={section.id} className="border-none rounded-lg mb-4 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 cursor-pointer hover:no-underline transition-all group">
                <div className="flex items-center gap-3 text-left flex-grow">
                    <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Folder size={18} />
                    </div>
                    <span className="font-medium text-white">{section.section}</span>

                    {(onEdit || onDelete) && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2">
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(section.id, 'section');
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-500"
                                >
                                    <Edit size={16} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(section.id, 'section');
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-transparent border-none p-4">
                <div className="space-y-2">
                    <Accordion
                        type="multiple"
                        className="w-full border-none flex flex-col gap-3"
                        value={openTopics}
                        onValueChange={onOpenTopicsChange}
                    >
                        {section.topics.map((topic) => (
                            <TopicItem
                                key={topic.id}
                                topic={topic}
                                sectionId={section.id}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddSubtopic={onAddSubtopic}
                            />
                        ))}
                    </Accordion>

                    {onAddTopic && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddTopic(section.id)}
                            className="mt-2 w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                        >
                            <Plus size={16} /> Add Topic
                        </Button>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function TopicItem({ topic, sectionId, onEdit, onDelete, onAddSubtopic }: {
    topic: Topic,
    sectionId: string,
    onEdit?: SyllabusAccordionProps['onEdit'],
    onDelete?: SyllabusAccordionProps['onDelete'],
    onAddSubtopic?: SyllabusAccordionProps['onAddSubtopic']
}) {
    return (
        <AccordionItem value={topic.id} className="border-none rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-2 cursor-pointer hover:no-underline transition-all group">
                <div className="flex items-center gap-3 text-left flex-grow">
                    <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Folder size={14} />
                    </div>
                    <span className="text-sm font-medium text-white">{topic.title}</span>

                    {(onEdit || onDelete) && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2">
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(sectionId, 'topic', topic.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-500"
                                >
                                    <Edit size={14} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(sectionId, 'topic', topic.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </AccordionTrigger>

            <AccordionContent className="bg-transparent border-none py-2 px-4">
                <div className="ml-9 space-y-2">
                    {topic.subtopics && topic.subtopics.length > 0 ? (
                        topic.subtopics.map((subtopic) => (
                            <SubtopicItem
                                key={subtopic.id}
                                subtopic={subtopic}
                                sectionId={sectionId}
                                topicId={topic.id}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <div className="py-1 text-gray-400 text-sm italic">
                            No subtopics available
                        </div>
                    )}

                    {onAddSubtopic && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddSubtopic(sectionId, topic.id)}
                            className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-purple-500 hover:bg-purple-500/10"
                        >
                            <Plus size={14} /> Add Subtopic
                        </Button>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function SubtopicItem({ subtopic, sectionId, topicId, onEdit, onDelete }: {
    subtopic: SubTopic,
    sectionId: string,
    topicId: string,
    onEdit?: SyllabusAccordionProps['onEdit'],
    onDelete?: SyllabusAccordionProps['onDelete']
}) {
    return (
        <div className="flex items-center py-2 px-2 rounded-md text-sm group hover:bg-gray-800/30">
            <div className="w-5 h-5 mr-2 flex-shrink-0 rounded bg-purple-500/20 flex items-center justify-center text-purple-500">
                <FileText size={12} />
            </div>
            <span className="text-white">{subtopic.title}</span>

            {(onEdit || onDelete) && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(sectionId, 'subtopic', topicId, subtopic.id);
                            }}
                            className="p-1 text-gray-400 cursor-pointer hover:text-blue-500"
                        >
                            <Edit size={12} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(sectionId, 'subtopic', topicId, subtopic.id);
                            }}
                            className="p-1 text-gray-400 cursor-pointer hover:text-red-500"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}