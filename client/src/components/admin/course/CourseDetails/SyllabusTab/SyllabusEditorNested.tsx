// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { FolderPlus, Loader2 } from "lucide-react";
// import { useState } from "react";
// import SyllabusAccordion from "./SyllabusAccordion";
// import { mockNestedSyllabus } from "./SyllabusTab/mockNestedSyllabus";

// // Define types for our syllabus structure
// interface SubTopic {
//     id: string;
//     title: string;
// }

// interface Topic {
//     id: string;
//     title: string;
//     subtopics: SubTopic[];
// }

// interface Section {
//     id: string;
//     section: string;
//     topics: Topic[];
// }

// interface SyllabusEditorProps {
//     syllabus: Section[];
//     onSave: (syllabus: Section[]) => void;
//     saving?: boolean;
// }
// export default function SyllabusEditorNested({ onSave, saving = false }: SyllabusEditorProps) {
//     // Use our rich nested syllabus mock data instead of the flat structure
//     const [syllabus, setSyllabus] = useState<Section[]>(mockNestedSyllabus);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [currentItem, setCurrentItem] = useState<{
//         sectionId: string;
//         type: 'section' | 'topic' | 'subtopic';
//         itemId?: string;
//         subItemId?: string;
//         title: string;
//     } | null>(null);

//     // Handle editing of an item
//     const handleEdit = (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => {
//         // Find the item to edit
//         let title = "";
//         const section = syllabus.find(s => s.id === sectionId);

//         if (!section) return;

//         if (type === 'section') {
//             title = section.section;
//         } else if (type === 'topic' && itemId) {
//             const topic = section.topics.find(t => t.id === itemId);
//             if (topic) title = topic.title;
//         } else if (type === 'subtopic' && itemId && subItemId) {
//             const topic = section.topics.find(t => t.id === itemId);
//             if (topic) {
//                 const subtopic = topic.subtopics?.find(st => st.id === subItemId);
//                 if (subtopic) title = subtopic.title;
//             }
//         }

//         setCurrentItem({ sectionId, type, itemId, subItemId, title });
//         setEditDialogOpen(true);
//     };

//     // Handle deletion of an item
//     const handleDelete = (sectionId: string, type: 'section' | 'topic' | 'subtopic', itemId?: string, subItemId?: string) => {
//         // Find the item to delete
//         let title = "";
//         const section = syllabus.find(s => s.id === sectionId);

//         if (!section) return;

//         if (type === 'section') {
//             title = section.section;
//         } else if (type === 'topic' && itemId) {
//             const topic = section.topics.find(t => t.id === itemId);
//             if (topic) title = topic.title;
//         } else if (type === 'subtopic' && itemId && subItemId) {
//             const topic = section.topics.find(t => t.id === itemId);
//             if (topic) {
//                 const subtopic = topic.subtopics?.find(st => st.id === subItemId);
//                 if (subtopic) title = subtopic.title;
//             }
//         }

//         setCurrentItem({ sectionId, type, itemId, subItemId, title });
//         setDeleteDialogOpen(true);
//     };

//     // Save edited item
//     const saveEditedItem = () => {
//         if (!currentItem) return;

//         const { sectionId, type, itemId, subItemId, title } = currentItem;

//         const updatedSyllabus = [...syllabus];
//         const sectionIndex = updatedSyllabus.findIndex(s => s.id === sectionId);

//         if (sectionIndex === -1) return;

//         if (type === 'section') {
//             updatedSyllabus[sectionIndex] = {
//                 ...updatedSyllabus[sectionIndex],
//                 section: title
//             };
//         } else if (type === 'topic' && itemId) {
//             const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === itemId);
//             if (topicIndex !== -1) {
//                 updatedSyllabus[sectionIndex].topics[topicIndex] = {
//                     ...updatedSyllabus[sectionIndex].topics[topicIndex],
//                     title
//                 };
//             }
//         } else if (type === 'subtopic' && itemId && subItemId) {
//             const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === itemId);
//             if (topicIndex !== -1) {
//                 const subtopics = updatedSyllabus[sectionIndex].topics[topicIndex].subtopics || [];
//                 const subtopicIndex = subtopics.findIndex(st => st.id === subItemId);

//                 if (subtopicIndex !== -1) {
//                     updatedSyllabus[sectionIndex].topics[topicIndex].subtopics[subtopicIndex] = {
//                         ...subtopics[subtopicIndex],
//                         title
//                     };
//                 }
//             }
//         }

//         setSyllabus(updatedSyllabus);
//         setEditDialogOpen(false);
//         setCurrentItem(null);
//     };

//     // Delete item
//     const confirmDelete = () => {
//         if (!currentItem) return;

//         const { sectionId, type, itemId, subItemId } = currentItem;

//         const updatedSyllabus = [...syllabus];
//         const sectionIndex = updatedSyllabus.findIndex(s => s.id === sectionId);

//         if (sectionIndex === -1) return;

//         if (type === 'section') {
//             setSyllabus(updatedSyllabus.filter(s => s.id !== sectionId));
//         } else if (type === 'topic' && itemId) {
//             updatedSyllabus[sectionIndex] = {
//                 ...updatedSyllabus[sectionIndex],
//                 topics: updatedSyllabus[sectionIndex].topics.filter(t => t.id !== itemId)
//             };
//             setSyllabus(updatedSyllabus);
//         } else if (type === 'subtopic' && itemId && subItemId) {
//             const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === itemId);
//             if (topicIndex !== -1 && updatedSyllabus[sectionIndex].topics[topicIndex].subtopics) {
//                 updatedSyllabus[sectionIndex].topics[topicIndex] = {
//                     ...updatedSyllabus[sectionIndex].topics[topicIndex],
//                     subtopics: updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.filter(
//                         st => st.id !== subItemId
//                     )
//                 };
//                 setSyllabus(updatedSyllabus);
//             }
//         }

//         setDeleteDialogOpen(false);
//         setCurrentItem(null);
//     };

//     // Add new section
//     const addSection = () => {
//         const newSection: Section = {
//             id: `section-${Date.now()}`,
//             section: "New Section",
//             topics: []
//         };

//         setSyllabus([...syllabus, newSection]);
//     };

//     // Add new topic to a section
//     const addTopic = (sectionId: string) => {
//         const updatedSyllabus = [...syllabus];
//         const sectionIndex = updatedSyllabus.findIndex(s => s.id === sectionId);

//         if (sectionIndex === -1) return;

//         const newTopic: Topic = {
//             id: `topic-${Date.now()}`,
//             title: "New Topic",
//             subtopics: []
//         };

//         updatedSyllabus[sectionIndex].topics.push(newTopic);
//         setSyllabus(updatedSyllabus);
//     };

//     // Add new subtopic to a topic
//     const addSubtopic = (sectionId: string, topicId: string) => {
//         const updatedSyllabus = [...syllabus];
//         const sectionIndex = updatedSyllabus.findIndex(s => s.id === sectionId);

//         if (sectionIndex === -1) return;

//         const topicIndex = updatedSyllabus[sectionIndex].topics.findIndex(t => t.id === topicId);

//         if (topicIndex === -1) return;

//         const newSubtopic: SubTopic = {
//             id: `subtopic-${Date.now()}`,
//             title: "New Subtopic"
//         };

//         if (!updatedSyllabus[sectionIndex].topics[topicIndex].subtopics) {
//             updatedSyllabus[sectionIndex].topics[topicIndex].subtopics = [];
//         }

//         updatedSyllabus[sectionIndex].topics[topicIndex].subtopics.push(newSubtopic);
//         setSyllabus(updatedSyllabus);
//     };

//     const handleSave = () => {
//         onSave(syllabus);
//     };

//     return (
//         <div className="space-y-4">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-medium">Course Syllabus</h3>
//                 <div className="flex gap-2">
//                     <Button
//                         variant="outline"
//                         onClick={addSection}
//                         className="flex items-center gap-2"
//                     >
//                         <FolderPlus size={16} />
//                         Add Section
//                     </Button>
//                     <Button onClick={handleSave} disabled={saving}>
//                         {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                         Save Changes
//                     </Button>
//                 </div>
//             </div>

//             <Card className="border border-gray-700 bg-gray-900 p-6">
//                 <SyllabusAccordion
//                     syllabus={syllabus}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                 />

//                 {syllabus.length === 0 && (
//                     <div className="text-center py-8 text-gray-400">
//                         {"No syllabus content yet. Click \"Add Section\" to start building your course syllabus."}
//                     </div>

//                 )}
//             </Card>

//             {/* Edit dialog */}
//             <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>
//                             Edit {currentItem?.type === 'section' ? 'Section' : currentItem?.type === 'topic' ? 'Topic' : 'Subtopic'}
//                         </DialogTitle>
//                     </DialogHeader>

//                     <div className="py-4">
//                         <Input
//                             value={currentItem?.title || ''}
//                             onChange={(e) => setCurrentItem(prev => prev ? { ...prev, title: e.target.value } : null)}
//                             placeholder="Enter title"
//                             className="bg-gray-800 text-white"
//                         />
//                     </div>

//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={saveEditedItem}>
//                             Save
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Delete confirmation dialog */}
//             <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Confirm Deletion</DialogTitle>
//                     </DialogHeader>

//                     <div className="py-4">
//                         Are you sure you want to delete &quot;{currentItem?.title}&quot;?
//                         {currentItem?.type === 'section' && (
//                             <p className="text-red-400 mt-2">This will also delete all topics and subtopics in this section.</p>
//                         )}
//                         {currentItem?.type === 'topic' && (
//                             <p className="text-red-400 mt-2">This will also delete all subtopics in this topic.</p>
//                         )}
//                     </div>

//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//                             Cancel
//                         </Button>
//                         <Button variant="destructive" onClick={confirmDelete}>
//                             Delete
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }