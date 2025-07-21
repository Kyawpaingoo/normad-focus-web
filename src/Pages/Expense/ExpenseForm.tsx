import { Stack, TextField, Button, MenuItem } from "@mui/material"
import SidebarModal from "../../Components/SidebarModal"
import { useState, useEffect } from "react";
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

            <Stack spacing={2}>
                <TextField 
                    label='Title' 
                    variant="standard" 
                    fullWidth value={form.title} 
                    onChange={(e) => handleChange('title', e.target.value)}
                />

                <TextField
                    label="Amount"
                    variant="standard"
                    fullWidth
                    type="number"
                    value={form.amount}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                />

                <TextField
                    label="Category"
                    variant="standard"
                    fullWidth
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                />

                <TextField id="expense-type-select" select label="Expense Type" value={form.type} onChange={(e)=> handleChange('type', e.target.value)}>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Expense">Expense</MenuItem>
                </TextField>

                <TextField
                    label="Currency"
                    variant="standard"
                    fullWidth
                    value={form.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                />

                <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={formatDateForInput(form.expense_date)}
                    onChange={(e) => handleDateChange(e.target.value)}
                />

                <TextField
                    id="outlined-multiline-static"
                    label="Note"
                    fullWidth
                    value={form.note}
                    multiline
                    rows={4}
                    onChange={(e) => handleChange('note', e.target.value)}
                />
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2} justifyContent={'flex-end'}>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Confirm</Button>
            </Stack>
        </SidebarModal>
    )
}

export default ExpenseForm;