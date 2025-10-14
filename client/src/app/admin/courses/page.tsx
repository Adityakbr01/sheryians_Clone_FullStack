"use client";

import CreateCourse from "@/components/admin/course/CreateCourse";
import CourseCard from "../../../components/admin/course/CourseCard";
import DeleteCourseDialog from "@/components/admin/course/DeleteCourseDialog";
import { useGetCourses, useDeleteCourse } from "@/hooks/TanStack/courseHooks";
import { Course } from "@/types/course";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function Page() {
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data, isLoading } = useGetCourses();
    const deleteCourseMutation = useDeleteCourse();
    const courses: Course[] = data?.data || [];

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setIsAddingCourse(true);
    };

    const handleCloseModal = () => {
        setIsAddingCourse(false);
        setEditingCourse(null);
    };

    const handleDelete = () => {
        if (!courseToDelete) return;
        const toastId = toast.loading("Deleting course...");

        deleteCourseMutation.mutate(courseToDelete, {
            onSuccess: () => {
                toast.success("Course deleted successfully", { id: toastId });
                setCourseToDelete(null);
                setIsDeleteDialogOpen(false);
            },
            onError: (error) => {
                toast.error(`Failed to delete course: ${error instanceof Error ? error.message : "Unknown error"}`, { id: toastId });
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const skeletonCount = 6;

    return (
        <div className="w-full h-full p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                <button
                    onClick={() => setIsAddingCourse(true)}
                    className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Add Course
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: skeletonCount }).map((_, idx) => (
                        <Skeleton key={idx} className="h-[400px] rounded bg-[var(--custom-inputColor)]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            onEdit={handleEdit}
                            onDelete={(id) => {
                                setCourseToDelete(id);
                                setIsDeleteDialogOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {isAddingCourse && (
                <CreateCourse
                    isOpen={isAddingCourse}
                    onOpenChange={handleCloseModal}
                    editData={editingCourse}
                />
            )}

            <DeleteCourseDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={deleteCourseMutation.isPending}
            />
        </div>
    );
}
