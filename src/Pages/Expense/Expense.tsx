import { Alert, Box, Button, Grid, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
//import { expenseIncomeData } from "../DummyData/expenseData";
import ExpenseBreakdownCard from "../../Components/ExpenseBreakdownCard";
import IncomeVsExpenseCard from "../../Components/IncomeVsExpenseCard";
import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { useMutation, useQuery } from "@tanstack/react-query";
import { createExpense, getExpenseByPaging, softDeleteExpense, updateExpense } from '../../ApiRequestHelpers/expenseApiRequest';
import type { PaginationResponse, sortDirection } from "../../dtos/responseDtos";
import type { ExpenseDto, upsertExpenseRequestDto } from "../../dtos/expenseDtos";
import dayjs from 'dayjs'
import { queryClient } from "../../Hooks/QueryClient";
import PopupModal from "../../Components/Modal";
import ExpenseForm from "./ExpenseForm";
import { useThemeHook } from "../../Context/Theme";

 type deleteData = {
    id: number,
    userId: number
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const ExpenseDashboard : React.FC = () => {
    const {auth} = useThemeHook();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [year, setYear] = useState(2025);
    const [month, setMonth] = useState(6);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<sortDirection>('desc');

    const [message, setMessage] = useState<string | null>(null);
    
    const [deleteId, setDeleteId] = useState<deleteData | null>(null);
    const [expenseForm, setExpenseForm] = useState<upsertExpenseRequestDto | null>(null);

    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isExpenseFormModalOpen, setExpenseFormModalOpen] = useState<boolean>(false);

    const queryKey = ['expense', page, pageSize, year, month, category ?? null, type ?? null, sortDir] as const;
    
    const {isLoading, isError, data, error} = useQuery<PaginationResponse<ExpenseDto>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getExpenseByPaging(page, pageSize, auth.id, 2025, 6, 'desc'),
    });

    const addExpense = useMutation<ExpenseDto, Error, upsertExpenseRequestDto>({
        mutationFn: async (data: upsertExpenseRequestDto) => {
            const expenseWithUserId = {
                ...data,
                userId: auth.id
            }
            return await createExpense(expenseWithUserId)
        },
        onMutate: async (newExpense: upsertExpenseRequestDto) => {
            queryClient.cancelQueries({queryKey});
            const previousData = queryClient.getQueryData(queryKey);

            if(previousData)
            {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<ExpenseDto>) => {
                    return {
                        ...oldData,
                        results: [
                            {...newExpense, id: Date.now()}, 
                            ...oldData.results]
                    }
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },

        onError: () => {
            queryClient.setQueryData(['expense', page, pageSize], (oldData: PaginationResponse<ExpenseDto>) => {
                if(!oldData) return oldData;
            });
        }
    });

    const editExpense = useMutation<ExpenseDto, Error, { data: upsertExpenseRequestDto, id: number, userId: number }>({
        mutationFn: async ({ data, id, userId }) => await updateExpense(data, id, userId),
        onMutate: async ({ data, id }: { data: upsertExpenseRequestDto, id: number, userId: number }) => {
            queryClient.cancelQueries({queryKey});
            const previousData = queryClient.getQueryData(['expense', page, pageSize]);

            if(previousData)
            {
                queryClient.setQueryData(['expense', page, pageSize], (oldData: PaginationResponse<ExpenseDto>) => {
                    return {
                        ...oldData,
                        results: oldData.results.map((expense: ExpenseDto) => expense.id === id ? data : expense)
                    }
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.setQueryData(['expense', page, pageSize], (oldData: PaginationResponse<ExpenseDto>) => {
                if(!oldData) return oldData;
            });
        }
    })

    const removeExpense = useMutation<string, Error, { id: number, userId: number }>(
        {
            mutationFn: async ({ id, userId }) => await softDeleteExpense(id, userId),
            onMutate: async ({ id }: { id: number, userId: number }) => {
                queryClient.cancelQueries({queryKey});
                const previousData = queryClient.getQueryData(['expense', page, pageSize]);

                if(previousData)
                {
                    queryClient.setQueryData(['expense', page, pageSize], (oldData: PaginationResponse<ExpenseDto>) => {
                        return {
                            ...oldData,
                            results: oldData.results.filter((expense: ExpenseDto) => expense.id !== id)
                        }
                    });
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey});
            }
        },
    );

    
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
            const expenseForm = {...formData, userId: 8};
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

            <Grid container spacing={2} sx={{mb:3}}>
                <Grid size={4}>
                    <Item>
                        <ExpenseBreakdownCard />
                    </Item>
                    
                </Grid>

                <Grid size={4}>
                    <Item>
                        <IncomeVsExpenseCard />
                    </Item>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{borderRadius: 2, border: '1px solid #E7EAEE', p: 2}}>
                <Typography variant="h6" sx={{mb: 2, fontWeight: 700}}>
                    Expense & Income
                </Typography>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data?.results.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{dayjs(row.expense_date).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.currency}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>
                                        <Button variant="text" color="primary" sx={{ mr: 1 }} onClick={()=>showExpenseFormModal(row)}>View Details</Button>
                                        |
                                        <Button variant="text" color="error" sx={{ ml: 1 }}  onClick={()=>showDeleteModal({ id: row.id, userId: row.user_id })}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display='flex' justifyContent={'center'} sx={{mt: 2}}>
                    <Pagination 
                        count={data?.totalPage}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Paper>

            <PopupModal open={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} title='Delete Expense'>
                <Typography>Are you sure you want to delete this item</Typography>
            </PopupModal>

            <ExpenseForm open={isExpenseFormModalOpen} onClose={closeExpenseFormModal} onSubmit={handleExpenseFormSubmit} defaultValues={expenseForm} />
        </Box>
    )
}

export default ExpenseDashboard