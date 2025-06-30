import { useMutation } from "@tanstack/react-query";
import { createExpense, softDeleteExpense, updateExpense } from '../ApiRequestHelpers/expenseApiRequest';
import type { ExpenseDto, upsertExpenseRequestDto } from "../dtos/expenseDtos";
import type { PaginationResponse } from "../dtos/responseDtos";
import { queryClient } from "../Hooks/QueryClient";

export const useExpenseMutations = (queryKey: readonly unknown[], page: number, pageSize: number, userId: number) => {
    const addExpense = useMutation<ExpenseDto, Error, upsertExpenseRequestDto>({
        mutationFn: async (data: upsertExpenseRequestDto) => {
            const expenseWithUserId = {
                ...data,
                userId: userId
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

    return { addExpense, editExpense, removeExpense };
}