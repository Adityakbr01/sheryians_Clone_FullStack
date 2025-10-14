"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCourseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function DeleteCourseDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: DeleteCourseDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] text-white border-[#3c3c3c]">
                <DialogHeader>
                    <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Are you sure you want to delete this course? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="bg-transparent border-[#3c3c3c] text-white hover:bg-[#2c2c2c] hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete Course"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
