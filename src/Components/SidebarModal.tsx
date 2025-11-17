import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const SidebarModal: React.FC<SidebarModalProps> = ({open, onClose, title, children}) => {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-[450px] h-screen border-r border-border bg-[#f8f9fa] p-4 overflow-y-auto"
            >
                <div className="flex flex-row justify-between items-center h-10 mt-2 mb-2">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <hr className="mb-4 border-border" />

                {children}
            </SheetContent>
        </Sheet>
    )
}

export default SidebarModal;