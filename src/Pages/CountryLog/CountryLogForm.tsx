import { useEffect, useState } from "react";
import type { upsertCountryLog } from "../../dtos/countryLogDtos";
import SidebarModal from "../../Components/SidebarModal";
import { Button, Stack, TextField } from "@mui/material";
import { formatDateTimeForInput } from "../../Ultils/Helper";

interface CountryLogProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (form: upsertCountryLog) => void;
    defaultValues: upsertCountryLog | null;
}

const defaultCountryLog : upsertCountryLog = {
    id: 0,
    user_id: 0,
    country_name: '',
    visa_type: '',
    visa_limit_days: 0,
    entry_date: new Date(),
    exit_date: new Date(),
    notify_at: new Date()
}

const CountryLogForm: React.FC<CountryLogProps> = ({open, onClose, onSubmit, defaultValues}) => {
    const [form, setForm] = useState<upsertCountryLog>(defaultCountryLog);

    useEffect(()=> {
        setForm({
            id: defaultValues?.id || 0,
            user_id: defaultValues?.user_id || 0,
            country_name: defaultValues?.country_name || '',
            visa_type: defaultValues?.visa_type || '',
            visa_limit_days: defaultValues?.visa_limit_days || 0,
            entry_date: defaultValues?.entry_date || new Date(),
            exit_date: defaultValues?.exit_date || new Date(),
            notify_at: defaultValues?.notify_at || new Date()
        })
    }, [defaultValues]);

    const handleChange = (field: keyof upsertCountryLog, value: string | number | Date) => {
        setForm(prev => ({...prev, [field]: value}))
    }

    const calculateVisaLimitDays = (entry: Date, exit: Date): number => {
        const diffInMs = exit.getTime() - entry.getTime();
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        return diffInDays > 0 ? diffInDays : 0;
    };

    const handleEntryDateChange = (dateString: string) => {
        const newEntryDate = new Date(dateString);
        const updatedDays = calculateVisaLimitDays(newEntryDate, form.exit_date);
        setForm(prev => ({
            ...prev,
            entry_date: newEntryDate,
            visa_limit_days: updatedDays
        }));
    }

    const handleExitDateChange = (dateString: string) => {
        const newExitDate = new Date(dateString);
        const updatedDays = calculateVisaLimitDays(form.entry_date, newExitDate);
        setForm(prev => ({
            ...prev,
            exit_date: newExitDate,
            visa_limit_days: updatedDays
        }));
    }

    const handleNotfiyDateChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('notify_at', date)
    }

    const handleSave = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <SidebarModal
            open={open}
            onClose={onClose}
            title={defaultValues ? 'Edit Country Log' : 'Add Country Log'}
        >

            <Stack spacing={2}>
                <TextField 
                    label='Country Name' 
                    variant="standard" 
                    fullWidth value={form.country_name} 
                    onChange={(e) => handleChange('country_name', e.target.value)}
                />

                <TextField
                    label='Visa Type' 
                    variant="standard" 
                    fullWidth value={form.visa_type} 
                    onChange={(e) => handleChange('visa_type', e.target.value)}
                />

                <TextField
                    label="Entry Date"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={formatDateTimeForInput(form.entry_date)}
                    onChange={(e) => handleEntryDateChange(e.target.value)}
                />

                <TextField
                    label="Exit Date"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={formatDateTimeForInput(form.exit_date)}
                    onChange={(e) => handleExitDateChange(e.target.value)}
                />

                <TextField
                    label="Notify Date"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={formatDateTimeForInput(form.notify_at)}
                    onChange={(e) => handleNotfiyDateChange(e.target.value)}
                />
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2} justifyContent={'flex-end'}>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Confirm</Button>
            </Stack>
        </SidebarModal>
    )
}

export default CountryLogForm;