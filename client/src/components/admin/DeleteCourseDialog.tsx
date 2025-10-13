'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

import { Course } from "@/types/course";

interface DeleteCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course | null;
    onDelete: () => void;
}

const DeleteCourseDialog = ({
    open,
    onOpenChange,
    course,
    onDelete,
}: DeleteCourseDialogProps) => {
    if (!course) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Course Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this course? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center space-x-2 p-4 bg-destructive/10 text-destructive rounded-md mb-5 border border-destructive/20">
                        <AlertCircle className="h-6 w-6 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Warning: This action is irreversible</p>
                            <p className="text-sm text-destructive/80 mt-1">
                                Once deleted, all course data including student enrollments will be permanently removed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 bg-muted/30 p-4 rounded-md border">
                        <div className="font-semibold text-lg">Course details:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Title</p>
                                <p className="font-medium">{course.title}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-medium">{course.category}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium">{course.type}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Students Enrolled</p>
                                <p className="font-medium">{course.studentsEnrolled || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onDelete}>
                        Delete Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteCourseDialog;