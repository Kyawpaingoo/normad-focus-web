import { Stack, TextField, Button, MenuItem } from "@mui/material"
import SidebarModal from "../../Components/SidebarModal"
import React, { useState, useEffect } from "react";
import type { upsertTaskDto } from "../../dtos/taskDto";

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

    useEffect(()=> {
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
        })
    },[defaultValue]);

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

    const formatDateForInput = (date: Date): string => {
        return new Date(date).toISOString().substring(0, 10);
    };

    const handleSave = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <SidebarModal
            open={open}
            onClose={onClose}
            title={defaultValue ? "Edit Task" : "Add Task"}
        >
            <Stack spacing={2}>
                <TextField
                    label="Title"
                    variant="outlined"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />

                <TextField id="task-status-select" select label="Select Status" value={form.status} onChange={(e)=> handleChange('status', e.target.value)}>
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                </TextField>

                <TextField id="task-priority-select" select label="Select Priority" value={form.priority} onChange={(e)=> handleChange('priority', e.target.value)} >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                </TextField>

                <TextField
                    label="Start Date"
                    variant="outlined"
                    type="date"
                    value={formatDateForInput(form.start_date)}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                />
                <TextField
                    label="Due Date"
                    variant="outlined"
                    type="date"
                    value={formatDateForInput(form.due_date)}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                />
                <TextField
                    label="Notify At"
                    variant="outlined"
                    type="date"
                    value={formatDateForInput(form.notify_at)}
                    onChange={(e) => handleNotifyDateChange(e.target.value)}
                />
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2} justifyContent={'flex-end'}>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Confirm</Button>
            </Stack>
        </SidebarModal>
    )
}

export default TaskForm;