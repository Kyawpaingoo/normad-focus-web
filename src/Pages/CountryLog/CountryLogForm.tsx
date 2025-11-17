import { useEffect, useState } from "react";
import type { upsertCountryLog } from "../../dtos/countryLogDtos";
import SidebarModal from "../../Components/SidebarModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="country-name">Country Name</Label>
                    <Input
                        id="country-name"
                        value={form.country_name}
                        onChange={(e) => handleChange('country_name', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="visa-type">Visa Type</Label>
                    <Input
                        id="visa-type"
                        value={form.visa_type}
                        onChange={(e) => handleChange('visa_type', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="entry-date">Entry Date</Label>
                    <Input
                        id="entry-date"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.entry_date)}
                        onChange={(e) => handleEntryDateChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="exit-date">Exit Date</Label>
                    <Input
                        id="exit-date"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.exit_date)}
                        onChange={(e) => handleExitDateChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="notify-date">Notify Date</Label>
                    <Input
                        id="notify-date"
                        type="datetime-local"
                        value={formatDateTimeForInput(form.notify_at)}
                        onChange={(e) => handleNotfiyDateChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Visa Limit Days</Label>
                    <p className="text-sm text-muted-foreground">{form.visa_limit_days} days</p>
                </div>
            </div>

            <div className="flex flex-row gap-2 mt-4 justify-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Confirm</Button>
            </div>
        </SidebarModal>
    )
}

export default CountryLogForm;