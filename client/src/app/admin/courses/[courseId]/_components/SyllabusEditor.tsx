"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";

interface SyllabusEditorProps {
    syllabus: {
        section: string;
        topics: {
            title: string;
        }[];
    }[];
    onSave: (syllabus: any[]) => void;
    saving?: boolean;
}

export default function SyllabusEditor({ syllabus: initialSyllabus, onSave, saving = false }: SyllabusEditorProps) {
    const [syllabus, setSyllabus] = useState(initialSyllabus);
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const addSection = () => {
        setSyllabus([...syllabus, { section: "", topics: [] }]);
        setExpandedSection(syllabus.length);
    };

    const updateSection = (idx: number, section: string) => {
        const updated = [...syllabus];
        updated[idx] = { ...updated[idx], section };
        setSyllabus(updated);
    };

    const addTopic = (sectionIdx: number) => {
        const updated = [...syllabus];
        updated[sectionIdx].topics.push({ title: "" });
        setSyllabus(updated);
    };

    const updateTopic = (sectionIdx: number, topicIdx: number, title: string) => {
        const updated = [...syllabus];
        updated[sectionIdx].topics[topicIdx] = { title };
        setSyllabus(updated);
    };

    const removeSection = (idx: number) => {
        const updated = syllabus.filter((_, i) => i !== idx);
        setSyllabus(updated);
        if (expandedSection === idx) setExpandedSection(null);
    };

    const removeTopic = (sectionIdx: number, topicIdx: number) => {
        const updated = [...syllabus];
        updated[sectionIdx].topics = updated[sectionIdx].topics.filter(
            (_, i) => i !== topicIdx
        );
        setSyllabus(updated);
    };

    const handleSave = () => {
        onSave(syllabus);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Edit Syllabus</h3>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </div>

            {syllabus.map((section, sIdx) => (
                <Card key={sIdx} className="p-4 shadow-sm border bg-transparent">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1">
                            <Input
                                value={section.section}
                                onChange={(e) => updateSection(sIdx, e.target.value)}
                                placeholder="Section title"
                                className="font-semibold bg-transparent text-white"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}
                            >
                                {expandedSection === sIdx ? "Collapse" : "Expand"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => removeSection(sIdx)}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>

                    {expandedSection === sIdx && (
                        <div className="ml-4 space-y-2 mt-3">
                            {section.topics.map((topic, tIdx) => (
                                <div key={tIdx} className="flex items-center space-x-2">
                                    <Input
                                        value={topic.title}
                                        onChange={(e) => updateTopic(sIdx, tIdx, e.target.value)}
                                        placeholder="Topic title"
                                        className="bg-transparent text-white"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => removeTopic(sIdx, tIdx)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => addTopic(sIdx)}
                            >
                                <Plus size={16} className="mr-1" /> Add Topic
                            </Button>
                        </div>
                    )}
                </Card>
            ))}

            <Button
                variant="outline"
                onClick={addSection}
                className="w-full mt-4 border-dashed border-gray-500"
            >
                <Plus size={16} className="mr-1" /> Add Section
            </Button>
        </div>
    );
}