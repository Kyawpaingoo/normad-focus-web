import SidebarModal from "../../Components/SidebarModal"
import { useState, useEffect } from "react";
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
import type { upsertExpenseRequestDto } from '../../dtos/expenseDtos';

interface ExpenseFormProps {
    open: boolean
    onClose: () => void,
    onSubmit: (form: upsertExpenseRequestDto) => void;
    defaultValues: upsertExpenseRequestDto | null;
}

const defaultExpense: upsertExpenseRequestDto = {
  id: 0,
  userId: 0,
  title: '',
  amount: 0,
  category: '',
  type: 'Expense',
  currency: 'USD',
  expense_date: new Date(),
  note: ''
};

const ExpenseForm : React.FC<ExpenseFormProps> = ({open, onClose, onSubmit, defaultValues}) => {

    const [form, setForm] = useState<upsertExpenseRequestDto>(defaultExpense);

    useEffect(() => {
        setForm({
            id: defaultValues?.id || 0,
            userId: defaultValues?.userId || 0,
            title: defaultValues?.title || '',
            amount: defaultValues?.amount || 0,
            category: defaultValues?.category || '',
            type: defaultValues?.type || 'Expense',
            currency: defaultValues?.currency || 'USD',
            expense_date: defaultValues?.expense_date ? new Date(defaultValues.expense_date) : new Date(),
            note: defaultValues?.note || ''
        });
    }, [defaultValues]);



    const handleChange = (field: keyof upsertExpenseRequestDto, value: string | number | Date) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (dateString: string) => {
        const date = new Date(dateString);
        handleChange('expense_date', date);
    };

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
            title={defaultValues ? 'Edit Expense' : 'Add Expense'}
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
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={form.amount ?? 0}
                        onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={form.category ?? ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expense-type">Expense Type</Label>
                    <Select value={form.type ?? ''} onValueChange={(value) => handleChange('type', value)}>
                        <SelectTrigger id="expense-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                        id="currency"
                        value={form.currency ?? ''}
                        onChange={(e) => handleChange('currency', e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formatDateForInput(form.expense_date)}
                        onChange={(e) => handleDateChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="note">Note</Label>
                    <textarea
                        id="note"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.note ?? ''}
                        rows={4}
                        onChange={(e) => handleChange('note', e.target.value)}
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

export default ExpenseForm;