"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { FileText, Folder } from "lucide-react";

interface SubTopic {
    id: string;
    title: string;
}

interface Topic {
    id: string;
    title: string;
    subtopics?: SubTopic[];
}

interface Section {
    id: string;
    section: string;
    topics: Topic[];
}

interface SyllabusAccordionProps {
    syllabus: Section[];
    onEdit?: (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => void;
    onDelete?: (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => void;
}

export default function SyllabusAccordion({ syllabus, onEdit, onDelete }: SyllabusAccordionProps) {
    return (
        <div className="space-y-4">
            <Accordion type="multiple" className="w-full">
                {syllabus.map((section) => (
                    <SectionItem
                        key={section.id}
                        section={section}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </Accordion>
        </div>
    );
}

function SectionItem({ section, onEdit, onDelete }: {
    section: Section,
    onEdit?: SyllabusAccordionProps['onEdit'],
    onDelete?: SyllabusAccordionProps['onDelete']
}) {
    return (
        <AccordionItem value={section.id} className="border-none  rounded-lg mb-4 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-800/50 hover:no-underline transition-all">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Folder size={18} />
                    </div>
                    <span className="font-medium text-white">{section.section}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-transparent border-none  p-4">
                <div className="space-y-2">
                    <Accordion type="multiple" className="w-full border-none">
                        {section.topics.map((topic) => (
                            <TopicItem
                                key={topic.id}
                                topic={topic}
                                sectionId={section.id}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </Accordion>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function TopicItem({ topic, sectionId, onEdit, onDelete }: {
    topic: Topic,
    sectionId: string,
    onEdit?: SyllabusAccordionProps['onEdit'],
    onDelete?: SyllabusAccordionProps['onDelete']
}) {
    return (
        <AccordionItem value={topic.id} className="border border-gray-700 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-2 hover:bg-gray-800/50 hover:no-underline transition-all">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Folder size={14} />
                    </div>
                    <span className="text-sm font-medium text-white">{topic.title}</span>
                </div>
            </AccordionTrigger>

            <AccordionContent className="bg-transparent border-t border-gray-700 py-2 px-4">
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
        <div className="flex items-center py-2 px-2 rounded-md text-sm hover:bg-gray-800/50 group">
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
                            className="p-1 text-gray-400 hover:text-blue-500"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(sectionId, 'subtopic', topicId, subtopic.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}