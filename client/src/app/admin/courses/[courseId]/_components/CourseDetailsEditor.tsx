"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useUpdateCourse } from "@/hooks/TanStack/courseHooks";
import toast from "react-hot-toast";

// Import the Course type directly from the types file
import { Course } from "@/types/course";

// Use the imported Course type for the props
interface CourseDetailsEditorProps {
    course: Course;
}

export default function CourseDetailsEditor({ course: initialCourse }: CourseDetailsEditorProps) {
    const [course, setCourse] = useState<Course>(initialCourse);
    const [isSaving, setIsSaving] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const updateCourseMutation = useUpdateCourse();

    // Calculate effective price
    const effectivePrice = course.originalPrice * (1 - (course.discountPercentage / 100));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Special handling for batchStartDate to ensure it's in the correct format
        if (name === 'batchStartDate') {
            // For empty values, don't set anything
            if (!value) {
                setCourse({ ...course, [name]: undefined });
                return;
            }

            // Try to ensure the date is valid
            try {
                // The value from datetime-local input will be in format: YYYY-MM-DDThh:mm
                // We need to append seconds and timezone
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    setCourse({ ...course, [name]: date.toISOString() });
                }
            } catch {
                // If there's an error with the date, don't update the state
                // We just silently ignore invalid dates
            }
        } else {
            // Normal handling for all other fields
            setCourse({ ...course, [name]: value });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: parseFloat(value) });
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setCourse({ ...course, [name]: checked });
    };

    const handleSelectChange = (name: string, value: string) => {
        setCourse({ ...course, [name]: value });
    };

    const addTag = () => {
        if (!newTag.trim() || course.tags.includes(newTag.trim())) return;
        setCourse({ ...course, tags: [...course.tags, newTag.trim()] });
        setNewTag("");
    };

    const removeTag = (tag: string) => {
        setCourse({ ...course, tags: course.tags.filter((t: string) => t !== tag) });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);

            // Create a preview URL for the image
            const imageUrl = URL.createObjectURL(file);
            setCourse({ ...course, thumbnail: imageUrl });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Create FormData to send to API
            const formData = new FormData();

            // Create a copy of the course to modify date format
            const courseToSave = { ...course };

            // Handle batchStartDate properly - ensure it's in correct ISO format with timezone
            if (courseToSave.batchStartDate) {
                try {
                    // Parse the date and ensure it has proper ISO format with timezone
                    const date = new Date(courseToSave.batchStartDate);
                    if (!isNaN(date.getTime())) {
                        courseToSave.batchStartDate = date.toISOString();
                    } else {
                        // If date is invalid, don't send it
                        delete courseToSave.batchStartDate;
                    }
                } catch {
                    // If there's an error parsing the date, don't send it
                    delete courseToSave.batchStartDate;
                }
            } else {
                // If no date is provided, don't send it
                delete courseToSave.batchStartDate;
            }

            // Append all course data to FormData
            Object.entries(courseToSave).forEach(([key, value]) => {
                // Handle tags array specially
                if (key === 'tags' && Array.isArray(value)) {
                    value.forEach((tag, index) => {
                        formData.append(`tags[${index}]`, tag);
                    });
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            // Add thumbnail file if available
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }

            // Send update request
            const result = await updateCourseMutation.mutateAsync(formData);

            // Show success notification
            toast.success(`"${result.data.title}" updated successfully!`);
        } catch (error) {
            // Show error notification
            toast.error(`Failed to update course: ${error instanceof Error ? error.message : "Unknown error"}`);
            console.error("Update error:", error);
        } finally {
            setIsSaving(false);
        }
    }; return (
        <div className="space-y-6 text-white">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium font-HelveticaNow text-[#e9e9e9]">Course Details</h3>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#1bd1a6] hover:bg-[#18bb95] text-[#0c0c0c] font-HelveticaNow font-medium"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Card className="p-6 bg-[#0c0c0c] border border-[#3c3c3c]">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        <div className="space-y-1">
                            <Label
                                htmlFor="title"
                                className="text-[#ffffff] text-[12px] font-HelveticaNow font-medium"
                            >
                                Course Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter course title"
                                value={course.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="slug"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Slug (URL)
                            </Label>
                            <Input
                                disabled={true}
                                id="slug"
                                name="slug"
                                placeholder="Enter course slug"
                                value={course.slug}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="description"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Description
                            </Label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter course description"
                                value={course.description}
                                onChange={handleChange}
                                rows={5}
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] text-white px-4 font-light placeholder:text-[12px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Instructor */}

                    <div className="space-y-4">
                        <div className="border border-dashed border-gray-600 rounded-md p-4 text-center">
                            {course.thumbnail ? (
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 bg-gray-800 flex items-center justify-center rounded-md">
                                    No thumbnail
                                </div>
                            )}
                            <div className="relative mt-2">
                                <input
                                    type="file"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                                <Button
                                    size="sm"
                                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] text-[#e9e9e9] hover:bg-[#2a2a2a] hover:text-[#1bd1a6] font-HelveticaNow"
                                >
                                    Change Thumbnail
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="instructor"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Instructor
                            </Label>
                            <Input
                                disabled={true}
                                id="instructor"
                                name="instructor"
                                placeholder="Enter instructor name"
                                value={course.instructor}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-6 bg-[#3c3c3c]" />

                <h4 className="text-md font-medium mb-4 font-HelveticaNow text-[#e9e9e9]">Pricing</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label
                            htmlFor="originalPrice"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Original Price (₹)
                        </Label>
                        <Input
                            id="originalPrice"
                            name="originalPrice"
                            type="number"
                            placeholder="Enter original price"
                            value={course.originalPrice}
                            onChange={handleNumberChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="discountPercentage"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Discount %
                        </Label>
                        <Input
                            id="discountPercentage"
                            name="discountPercentage"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter discount percentage"
                            value={course.discountPercentage}
                            onChange={handleNumberChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="finalPrice"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Final Price
                        </Label>
                        <Input
                            id="finalPrice"
                            value={`₹${effectivePrice.toFixed(2)}`}
                            readOnly
                            className="opacity-70"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="offer"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Offer Label
                        </Label>
                        <Input
                            id="offer"
                            name="offer"
                            placeholder="Enter offer label"
                            value={course.offer}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                        <Switch
                            id="gst"
                            checked={course.gst}
                            onCheckedChange={(checked) => handleSwitchChange('gst', checked)}
                            className="data-[state=checked]:bg-[#1bd1a6] data-[state=checked]:border-[#1bd1a6]"
                        />
                        <Label
                            htmlFor="gst"
                            className="text-[#a6a6a6] text-[14px] font-HelveticaNow font-medium"
                        >
                            Apply GST
                        </Label>
                    </div>
                </div>

                <Separator className="my-6 bg-[#3c3c3c]" />

                <h4 className="text-md font-medium mb-4 font-HelveticaNow text-[#e9e9e9]">Classification</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label
                            htmlFor="category"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Category
                        </Label>
                        <Select
                            value={course.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                        >
                            <SelectTrigger className="border-b border-[#3c3c3c] rounded-sm outline-none bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow font-light">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow border border-[#3c3c3c]">
                                <SelectItem value="Web Development" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Web Development</SelectItem>
                                <SelectItem value="AI & Machine Learning" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">AI & Machine Learning</SelectItem>
                                <SelectItem value="Data Science & Analytics" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Data Science & Analytics</SelectItem>
                                <SelectItem value="Cloud & DevOps" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Cloud & DevOps</SelectItem>
                                <SelectItem value="Cybersecurity & IT" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Cybersecurity & IT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="subTag"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Sub-tag
                        </Label>
                        <Input
                            id="subTag"
                            name="subTag"
                            placeholder="Enter sub-tag"
                            value={course.subTag}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium">Tags</Label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {course.tags.map((tag: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-[#1bd1a6]/10 text-[#1bd1a6] flex items-center gap-1 font-HelveticaNow"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-xs hover:text-[#ff4f4f]"
                                    >
                                        ✕
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                id="newTag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add a tag"
                            />
                            <Button
                                variant="outline"
                                onClick={addTag}
                                className="bg-[#1e1e1e] border-[#3c3c3c] text-[#e9e9e9] hover:bg-[#2a2a2a] hover:text-[#1bd1a6] font-HelveticaNow"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-6 bg-[#3c3c3c]" />

                <h4 className="text-md font-medium mb-4 font-HelveticaNow text-[#e9e9e9]">Course Configuration</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label
                            htmlFor="type"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Course Type
                        </Label>
                        <Select
                            value={course.type}
                            onValueChange={(value) => handleSelectChange('type', value)}
                        >
                            <SelectTrigger className="border-b border-[#3c3c3c] rounded-sm outline-none bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow font-light">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow border border-[#3c3c3c]">
                                <SelectItem value="Live Batch" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Live Batch</SelectItem>
                                <SelectItem value="Recorded" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Recorded</SelectItem>
                                <SelectItem value="Hybrid" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="CourseLanguage"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Language
                        </Label>
                        <Select
                            value={course.CourseLanguage}
                            onValueChange={(value) => handleSelectChange('CourseLanguage', value)}
                        >
                            <SelectTrigger className="border-b border-[#3c3c3c] rounded-sm outline-none bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow font-light">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e1e1e] text-[#e9e9e9] font-HelveticaNow border border-[#3c3c3c]">
                                <SelectItem value="English" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">English</SelectItem>
                                <SelectItem value="Hindi" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Hindi</SelectItem>
                                <SelectItem value="Hinglish" className="focus:bg-[#2a2a2a] focus:text-[#1bd1a6]">Hinglish</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                        <Switch
                            id="providesCertificate"
                            checked={course.providesCertificate}
                            onCheckedChange={(checked) => handleSwitchChange('providesCertificate', checked)}
                        />
                        <Label
                            htmlFor="providesCertificate"
                            className="text-[#a6a6a6] text-[14px] font-HelveticaNow font-medium"
                        >
                            Provides Certificate
                        </Label>
                    </div>
                </div>

                {course.type === 'Live Batch' && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-1">
                            <Label
                                htmlFor="batchStartDate"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Batch Start Date
                            </Label>
                            <Input
                                id="batchStartDate"
                                name="batchStartDate"
                                type="datetime-local"
                                value={
                                    course.batchStartDate
                                        ? (() => {
                                            try {
                                                const date = new Date(course.batchStartDate);
                                                if (!isNaN(date.getTime())) {
                                                    return date.toISOString().slice(0, 16);
                                                }
                                                return '';
                                            } catch {
                                                return '';
                                            }
                                        })()
                                        : ''
                                }
                                onChange={handleChange}
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="schedule"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Schedule
                            </Label>
                            <Input
                                id="schedule"
                                name="schedule"
                                value={course.schedule || ''}
                                onChange={handleChange}
                                placeholder="e.g. Mon, Wed, Fri"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                        </div>
                    </div>
                )}

                <Separator className="my-6 bg-[#3c3c3c]" />

                <h4 className="text-md font-medium mb-4 font-HelveticaNow text-[#e9e9e9]">Course Metrics</h4>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label
                            htmlFor="totalContentHours"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Content Hours
                        </Label>
                        <Input
                            id="totalContentHours"
                            name="totalContentHours"
                            placeholder="Enter content hours"
                            value={course.totalContentHours || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="totalLectures"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Total Lectures
                        </Label>
                        <Input
                            id="totalLectures"
                            name="totalLectures"
                            placeholder="Enter total lectures"
                            value={course.totalLectures || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="totalQuestions"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Total Questions
                        </Label>
                        <Input
                            id="totalQuestions"
                            name="totalQuestions"
                            placeholder="Enter total questions"
                            value={course.totalQuestions || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="studentsEnrolled"
                            className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                        >
                            Students Enrolled
                        </Label>
                        <Input
                            disabled={true}
                            id="studentsEnrolled"
                            name="studentsEnrolled"
                            value={course.studentsEnrolled || 0}
                            readOnly
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}