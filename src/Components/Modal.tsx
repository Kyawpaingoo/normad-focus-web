import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PopupModalProps {
    open: boolean;
    onClose: ()=> void;
    title?: string;
    children?: React.ReactNode;
    onConfirm?: () => void;
}

const PopupModal: React.FC<PopupModalProps> =({open, onClose, title, children, onConfirm}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {children}
                </div>

                <DialogFooter className="flex flex-row gap-2 justify-end">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PopupModal;