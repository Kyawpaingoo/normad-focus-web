import { useMutation } from "@tanstack/react-query"
import type { TaskDto, upsertTaskDto } from "../dtos/taskDto"
import { createTask, softDeleteTask, updateTask } from "../ApiRequestHelpers/taskApiRequest"
import { queryClient } from "./QueryClient"
import type { FlexibleResponse, PaginationResponse } from "../dtos/responseDtos"
import { isInfiniteScrollResponse, isKanbanResponse, updateInfiniteScrollData, updateKanbanData } from "../Ultils/Helper"

export const useTaskMutatons = (queryKey: readonly unknown[], page: number, pageSize: number, userId: number)=> {
    const addTask = useMutation<TaskDto, Error, upsertTaskDto>({
        mutationFn: async (data: upsertTaskDto) => {
            const taskWithUserId = {
                ...data,
                userId: userId
            }
            return await createTask(taskWithUserId)
        },
        onMutate: async (newTask: upsertTaskDto) => {
            queryClient.cancelQueries({queryKey});
            const previousData = queryClient.getQueryData(queryKey);

            if(previousData)
            {
                queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>) => {
                    const optimisticTask = {
                        ...newTask,
                        id: Date.now(),
                        user_id: userId,
                        is_deleted: false,
                        created_at: new Date(),
                    } as TaskDto;
                    if(isInfiniteScrollResponse(oldData)) {
                        return updateInfiniteScrollData(oldData, (results: TaskDto[]) => [...results, optimisticTask]);
                    } else if(isKanbanResponse(oldData)) {
                        return updateKanbanData(oldData, (task: TaskDto) => task, undefined, optimisticTask);
                    }
                });
            }
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey});
        },
        onError: ()=> {
            queryClient.setQueryData(['task', page, pageSize], (oldData: PaginationResponse<TaskDto>) => {
                if(!oldData) return oldData;
            });
        }
    });

    const editTask = useMutation<TaskDto, Error, {data: upsertTaskDto, id: number, userId: number}>({
        mutationFn: async({data, id, userId}) => await updateTask(data, id, userId),
        onMutate: async ({ data, id }: { data: upsertTaskDto, id: number, userId: number }) => {
            queryClient.cancelQueries({queryKey});
            const previousData = queryClient.getQueryData(['task', page, pageSize]);

            if(previousData)
            {
                queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>)=> {
                    if(isInfiniteScrollResponse(oldData)) {
                        return updateInfiniteScrollData(oldData, (results)=> results.map((task: TaskDto) => task.id === id ? {...task, ...data} : task));
                    } else if(isKanbanResponse(oldData)) {
                        return updateKanbanData(oldData, (task: TaskDto) => task.id === id ? {...task, ...data} : task);
                    }
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.setQueryData(['task', page, pageSize], (oldData: PaginationResponse<TaskDto>) => {
                if(!oldData) return oldData;
            });
        } 
    });

    const removeTask = useMutation<string, Error, {id: number, userId: number}>(
        {
            mutationFn: async ({id, userId})=> await softDeleteTask(id, userId),
            onMutate: async ({id}: {id: number, userId: number}) => {
                queryClient.cancelQueries({queryKey});
                const previousData = queryClient.getQueryData(['task', page, pageSize]);

                if(previousData)
                {
                    queryClient.setQueryData(['task', page, pageSize], (oldData: FlexibleResponse<TaskDto>) => {
                        if(isInfiniteScrollResponse(oldData)) {
                            return updateInfiniteScrollData(oldData, (results) => results.filter((task: TaskDto) => task.id !== id));
                        }
                        else if(isKanbanResponse(oldData)) {
                            const updatedColumns = { ...oldData.columns };
                            Object.keys(updatedColumns).forEach(columnKey => {
                                 const column = updatedColumns[columnKey];
                                updatedColumns[columnKey] = {
                                    ...column,
                                    items: column.items.filter((task: TaskDto) => task.id !== id),
                                    totalCount: column.totalCount - 1,
                                };
                            });
                            return {
                                ...oldData,
                                columns: updatedColumns
                            }
                        }
                    })
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey});
            }
        }
    );

    return {addTask, editTask, removeTask};
}