import SidebarModal from "../../Components/SidebarModal"
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { upsertTaskDto } from "../../dtos/taskDto";
import { formatDateTimeForInput, toBase64 } from "../../Ultils/Helper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression'
import { imageUpload } from "../../ApiRequestHelpers/imageUploadApiRequest";

interface TaskFormProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (form: upsertTaskDto) => void,
    defaultValue: upsertTaskDto | null;
}

const defaultTask: upsertTaskDto = {
    id: 0,
    userId: 0,
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Low',
    start_date: new Date(),
    due_date: new Date(),
    notify_at: new Date(),
};

const TaskForm: React.FC<TaskFormProps> = ({open, onClose, onSubmit, defaultValue}) => {

    const [form, setForm] = useState<upsertTaskDto>(defaultTask);
    const [quillContent, setQuillContent] = useState('');
    const quillRef = useRef<ReactQuill>(null);

    useEffect(() => {
        setForm({
            id: defaultValue?.id || 0,
            userId: defaultValue?.userId || 0,
            title: defaultValue?.title || '',
            description: defaultValue?.description || '',
            status: defaultValue?.status || 'To Do',
            priority: defaultValue?.priority || 'Low',
            start_date: defaultValue?.start_date ? new Date(defaultValue.start_date) : new Date(),
            due_date: defaultValue?.due_date ? new Date(defaultValue.due_date) : new Date(),
            notify_at: defaultValue?.notify_at ? new Date(defaultValue.notify_at) : new Date(),
        });

         if (defaultValue?.description) {
            try {
                const parsed = JSON.parse(defaultValue.description);
                // If parsed is a valid Delta object, set it directly to quillContent
                if (parsed && parsed.ops) {
                    setQuillContent(''); // Clear first, then set in next effect
                    setTimeout(() => {
                        if (quillRef.current) {
                            quillRef.current.getEditor().setContents(parsed);
                        }
                    }, 0);
                } 
                // If parsed is a string inside JSON (double-stringified HTML)
                else if (typeof parsed === 'string') {
                    setQuillContent(parsed);
                } 
                else {
                    setQuillContent(defaultValue.description);
                }
            } catch {
                // Not valid JSON → assume HTML or plain text
                setQuillContent(defaultValue.description);
            }
        } else {
            setQuillContent('');
        }
        
    }, [defaultValue]);
    const handleQuillChange = (content: string) => {
        setQuillContent(content);
    }

    const handleChange = (field: keyof upsertTaskDto, value: string | number | Date) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    const handleStartDateChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('start_date', date);
    }

    const handleDueDateChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('due_date', date);
    }
    
    const handleNotifyDateChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('notify_at', date);
    }

    const handleImageUpload = useCallback(async () => {
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = async () => {
            if(input !== null && input.files !== null) {
                const file = input.files[0];

                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                });
                
                const base64String = await toBase64(compressedFile);
                const url = await imageUpload(base64String);
                
                const quill = quillRef.current;
                if (quill) {
                    const range = quill.getEditorSelection();
                    if(range)
                    {
                        quill.getEditor().insertEmbed(range.index, "image", url);
                    }
                }
            }
        }; 
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
    }), [handleImageUpload]);

    const handleSave = () => {
        const quill = quillRef.current;
        if (quill) {
            const delta = quill.getEditor().getContents();
            const jsonString = JSON.stringify(delta);
            setForm((prev) => ({ ...prev, description: jsonString }));

            onSubmit({ ...form, description: jsonString });
        } else {
            onSubmit(form);
        }
        onClose();
    };

    return (
        <SidebarModal
            open={open}
            onClose={onClose}
            title={defaultValue ? "Edit Task" : "Add Task"}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={form.title ?? ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <ReactQuill
                        key={defaultValue?.id || 'new-task'}
                        value={quillContent}
                        ref={quillRef}
                        onChange={handleQuillChange}
                        modules={modules}
                        theme="snow"
                        style={{ height: "200px", marginBottom: "80px" }}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={form.priority} onValueChange={(value) => handleChange('priority', value)}>
                        <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                        id="start-date"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.start_date ?? new Date())}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input
                        id="due-date"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.due_date ?? new Date())}
                        onChange={(e) => handleDueDateChange(e.target.value ?? new Date())}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="notify-at">Notify At</Label>
                    <Input
                        id="notify-at"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.notify_at ?? new Date())}
                        onChange={(e) => handleNotifyDateChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-2 mt-4 justify-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Confirm</Button>
            </div>
        </SidebarModal>
    )
}

export default TaskForm;