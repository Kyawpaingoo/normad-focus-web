import { 
    Alert, 
    Box, 
    Button, 
    Typography
} from "@mui/material";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExpenseByPaging } from "../../ApiRequestHelpers/expenseApiRequest";
import type { PaginationResponse } from "../../dtos/responseDtos";
import type { AdditionalData, ExpenseDto, upsertExpenseRequestDto, deleteData } from "../../dtos/expenseDtos";
import { useThemeHook } from "../../Context/Theme";
import PopupModal from "../../Components/Modal";
import ExpenseForm from "./ExpenseForm";
import { useExpenseFilter } from "../../Hooks/useExpenseFilters";
import { useExpenseMutations } from "../../Hooks/useExpenseMutation";
import ExpenseFilters from "../../Components/ExpenseComponents/ExpenseFilters";
import ExpenseStatsCards from "../../Components/ExpenseComponents/ExpenseStatsCards";
import ExpenseTable from "../../Components/ExpenseComponents/ExpenseTable";

const ExpenseDashboard : React.FC = () => {
    
    const {auth} = useThemeHook();
    const {filters, setters, handlers, utils} = useExpenseFilter();

    //const [message, setMessage] = useState<string | null>(null);
    
    const [deleteId, setDeleteId] = useState<deleteData | null>(null);
    const [expenseForm, setExpenseForm] = useState<upsertExpenseRequestDto | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isExpenseFormModalOpen, setExpenseFormModalOpen] = useState<boolean>(false);
    
    const queryKey = ['expense', filters.page, filters.pageSize, filters.year, filters.month, filters.searchQuery, filters.category ?? null, filters.type ?? null, filters.sortDir] as const;
    
    const {isLoading, isError, data, error} = useQuery<PaginationResponse<ExpenseDto>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getExpenseByPaging(filters.page, filters.pageSize, auth.id, filters.year ?? 2025, filters.month ?? 6, filters.sortDir ?? 'desc', filters.searchQuery ?? '', filters.category ?? '', filters.type ?? ''),
    });

    const { addExpense, editExpense, removeExpense } = useExpenseMutations(queryKey, filters.page, filters.pageSize, auth.id);

    const additionalData = useMemo<AdditionalData | null>(()=> {
        if(data?.additionalData) {
            return JSON.parse(data.additionalData) as AdditionalData; 
        }  
        return null
    }, [data?.additionalData]);
  
    const handleDelete = async () => {
        if(deleteId)
        {
            await removeExpense.mutateAsync(deleteId);
            closeDeleteModal();
        }
        
    }

    const handleExpenseFormSubmit = async (formData: upsertExpenseRequestDto) => {
        if(formData.id > 0){
            await editExpense.mutateAsync({data: formData, id: formData.id, userId: formData.userId});
        }
        else {
            const expenseForm = {...formData, userId: auth?.id};
            await addExpense.mutateAsync(expenseForm as upsertExpenseRequestDto);
        }
        closeExpenseFormModal();
    }

    const showDeleteModal = (data: deleteData) =>{
        setDeleteId(data);
        setDeleteModalOpen(true);
    } 
    
    const closeDeleteModal = () => setDeleteModalOpen(false);

    const showExpenseFormModal = (data: ExpenseDto | null) => {
        if (data) {
            setExpenseForm({
                id: data.id,
                userId: data.user_id,
                title: data.title,
                amount: data.amount,
                category: data.category,
                expense_date: data.expense_date ? new Date(data.expense_date) : new Date(),
                type: data.type,
                currency: data.currency || 'USD',
                note: data.note
            });
            } else {
                setExpenseForm(null);
            }
        
        setExpenseFormModalOpen(true);
    }

    const closeExpenseFormModal = () => setExpenseFormModalOpen(false);

    if(isError)
    {
        return (
        <Box>
            <Alert severity='warning'>{error.message}</Alert>
        </Box>
        )
    }

    if(isLoading)
    {
        return (
        <Box sx={{ textAlign: 'center'}}>
            Loading...
        </Box>
        )
    }

    return (
        <Box sx={{p: 4, minHeight: '100vh'}}>

            <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4" fontWeight={700}>Expenses</Typography>
                
                <Button variant="contained" color='primary' onClick={()=>showExpenseFormModal(null)}>
                    Add New
                </Button>
            </Box>

            {
                additionalData && (
                    <ExpenseStatsCards additionalData={additionalData} />
                )
            }

            <ExpenseFilters 
                filters={filters}
                handlers={handlers}
                setShowFilters={setters.setShowFilters}
                getActiveFiltersCount={utils.getActiveFiltersCount}
            />
            
            <ExpenseTable
                expenses={data?.results || []}
                totalPages={data?.totalPage || 0}
                currentPage={filters.page}
                onPageChange={setters.setPage}
                onViewDetails={showExpenseFormModal}
                onDelete={showDeleteModal}
            />

            <PopupModal open={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} title='Delete Expense'>
                <Typography>Are you sure you want to delete this item</Typography>
            </PopupModal>

            <ExpenseForm open={isExpenseFormModalOpen} onClose={closeExpenseFormModal} onSubmit={handleExpenseFormSubmit} defaultValues={expenseForm} />
        </Box>
    )
}

export default ExpenseDashboard