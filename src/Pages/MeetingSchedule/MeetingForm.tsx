import SidebarModal from "../../Components/SidebarModal"
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { upsertMeetingSchdeuleDto } from "../../dtos/meetingScheduleDtos";
import { formatDateTimeForInput } from "../../Ultils/Helper";

interface MeetingFormProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (form: upsertMeetingSchdeuleDto) => void;
    defaultValues: upsertMeetingSchdeuleDto | null;
}

const defaultMeetingSchedule : upsertMeetingSchdeuleDto = {
    id: 0,
    user_id: 0,
    title: '',
    description: '',
    start_time: new Date(),
    end_time: new Date()
}

const MeetingForm: React.FC<MeetingFormProps> = ({open, onClose, onSubmit, defaultValues}) => {
    const [form, setForm] = useState<upsertMeetingSchdeuleDto>(defaultMeetingSchedule);

    useEffect(()=> {
        setForm({
            id: defaultValues?.id || 0,
            user_id: defaultValues?.user_id || 0,
            title: defaultValues?.title || '',
            description: defaultValues?.description || '',
            start_time: defaultValues?.start_time || new Date(),
            end_time: defaultValues?.end_time || new Date()
        })
    }, [defaultValues]);

    const handleChange = (field: keyof upsertMeetingSchdeuleDto, value: string | number | Date) => {
        setForm(prev => ({...prev, [field]: value}))
    }

    const handleStartTimeChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('start_time', date)
    }

    const handleEndTimeChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('end_time', date)
    }

    const handleSave = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <SidebarModal
            open={open}
            onClose={onClose}
            title={defaultValues ? 'Edit Meeting' : 'Add Meeting'}
        >

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.description}
                        rows={4}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                        id="start-time"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.start_time)}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                        id="end-time"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.end_time)}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
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

export default MeetingForm;