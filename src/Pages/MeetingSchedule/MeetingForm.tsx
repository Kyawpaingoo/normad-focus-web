import { Stack, TextField, Button } from "@mui/material"
import SidebarModal from "../../Components/SidebarModal"
import React, { useState, useEffect } from "react";
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
            title={defaultValues ? 'Edit Expense' : 'Add Expense'}
        >

            <Stack spacing={2}>
                <TextField 
                    label='Title' 
                    variant="standard" 
                    fullWidth value={form.title} 
                    onChange={(e) => handleChange('title', e.target.value)}
                />

                <TextField
                    id="outlined-multiline-static"
                    label="Note"
                    fullWidth
                    value={form.description}
                    multiline
                    rows={4}
                    onChange={(e) => handleChange('description', e.target.value)}
                />

                <TextField
                    label="Date"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={formatDateTimeForInput(form.start_time)}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                />

                <TextField
                    label="Date"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={formatDateTimeForInput(form.end_time)}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                />
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2} justifyContent={'flex-end'}>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Confirm</Button>
            </Stack>
        </SidebarModal>
    )
}

export default MeetingForm;