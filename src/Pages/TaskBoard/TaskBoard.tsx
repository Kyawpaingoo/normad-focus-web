import type React from "react";
import { useCallback, useState } from "react";
import TaskTabNav from "../../Components/TaskComponents/TaskTabNav";
import { useThemeHook } from "../../Context/Theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type TaskDto, type TaskStatus, type upsertTaskDto} from '../../dtos/taskDto';
import { createTask, getTaskByView, softDeleteTask, updateTask } from "../../ApiRequestHelpers/taskApiRequest";
import { queryClient } from "../../Hooks/QueryClient";
import { type sortDirection, type FlexibleResponse, type ViewMode, type KanbanResponse, } from '../../dtos/responseDtos';
import { getColumnKeyFromStatus, isInfiniteScrollResponse, isKanbanResponse, updateInfiniteScrollData, updateKanbanData } from "../../Ultils/Helper";
import { type InfiniteScrollResponse } from "../../dtos/responseDtos";
import { Alert, Box, Button, Typography } from "@mui/material";
import TaskTableList from "../../Components/TaskComponents/TaskTableList";
import KanbanBoard from "../../Components/TaskComponents/KanbanBoard";
import TaskForm from "./TaskForm";
import TaskDeleteConfirmationModal from "../../Components/TaskComponents/TaskDeleteConfirmationModal";
import TaskFilters from "../../Components/TaskComponents/TaskFilters";

const TaskBoard: React.FC = () => {
    const {auth} = useThemeHook();
    const [viewMode, setViewMode] = useState<ViewMode>('board');
    const [cursor, setCursor] = useState<string>('');
    const [limit, setLimit] = useState<number>(20);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [sortDir, setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [priority, setPriority] = useState<string>('');
    const [taskForm, setTaskForm] = useState<upsertTaskDto | null>(null);
    const [isTaskFormModalOpen, setTaskFormModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [deleteTask, setDeleteTask] = useState<TaskDto | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [allTasks, setAllTasks] = useState<TaskDto[]>([]);

    const queryKey = ['tasks', viewMode, cursor, limit, year, month, sortDir, searchQuery, status, priority] as const;

    const addTask = useMutation<TaskDto, Error, upsertTaskDto>({
        mutationFn: async(data: upsertTaskDto) => {
            const taskWithUserId = {
                ...data,
                userId: auth?.id || 0
            }

            return await createTask(taskWithUserId);
        },
        onMutate: async(newTask: upsertTaskDto) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>)=> {
                    const optimisticTask = {
                        ...newTask,
                        id: Date.now(),
                        user_id: auth?.id,
                        is_deleted: false,
                        created_at: new Date(),
                    } as TaskDto;
                    if(isInfiniteScrollResponse(oldData)) {
                        return updateInfiniteScrollData(oldData, (results: TaskDto[])=> [
                            ...results, optimisticTask
                        ])
                    } else if (isKanbanResponse(oldData)) {
                        return updateKanbanData(oldData, (task: TaskDto)=> 
                            task, undefined, optimisticTask
                        )
                    }
                })
            }
        },
        onSuccess: (data) => {
           queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>) => {
            if (isInfiniteScrollResponse(oldData)) {
                return updateInfiniteScrollData(oldData, (results: TaskDto[]) =>
                    results.map(task =>
                        task.id === data.id ? { ...task, ...data } : task
                    )
                );
            } else if (isKanbanResponse(oldData)) {
                return updateKanbanData(
                    oldData,
                    (task: TaskDto) => (task.id === data.id ? { ...task, ...data } : task)
                );
            }
            return oldData;
        });

        queryClient.invalidateQueries({ queryKey });
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    });

    const editTask = useMutation<TaskDto, Error, {data: upsertTaskDto, id: number, userId: number}>({
        mutationFn: async ({data, id, userId}) => await updateTask(data, id, userId),
        onMutate: async ({ data, id }: { data: upsertTaskDto, id: number, userId: number }) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData)
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
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>) => {
                if (isInfiniteScrollResponse(oldData)) {
                    return updateInfiniteScrollData(oldData, (results: TaskDto[]) =>
                        results.map(task =>
                            task.id === data.id ? { ...task, ...data } : task
                        )
                    );
                } else if (isKanbanResponse(oldData)) {
                    return updateKanbanData(
                        oldData,
                        (task: TaskDto) => (task.id === data.id ? { ...task, ...data } : task)
                    );
                }
                return oldData;
            });

            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    });

    const updateTaskStatus = useMutation<TaskDto, Error, {taskId: number, newStatus: TaskStatus, userId: number}>({
        mutationFn: async({taskId, newStatus, userId}) => {
            const currentData = queryClient.getQueryData(queryKey) as FlexibleResponse<TaskDto>;
            let currentTask: TaskDto | undefined;

            if(isKanbanResponse(currentData)) {
                Object.values(currentData.columns).forEach(column => {
                    const foundTask = column.items.find(task => task.id === taskId);

                    if(foundTask) currentTask = foundTask;
                })
            }

            if (!currentTask) {
                throw new Error('Task not found');
            }

            const updateData: upsertTaskDto = {
                id: currentTask.id,
                userId: userId,
                title: currentTask.title,
                description: currentTask.description,
                status: newStatus, 
                priority: currentTask.priority,
                start_date: currentTask.start_date,
                due_date: currentTask.due_date,
                notify_at: currentTask.notify_at
            };

            return await updateTask(updateData, taskId, userId);
        },
        onMutate: async({taskId, newStatus}) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData && isKanbanResponse(prevData)) {
                queryClient.setQueryData(queryKey, (oldData: KanbanResponse<TaskDto>) => {
                    const newColumns = {...oldData.columns};
                    let taskToMove: TaskDto | undefined;
                    let sourceColumnKey: string | undefined;

                    Object.keys(newColumns).forEach(columnKey => {
                        const taskIndex = newColumns[columnKey].items.findIndex(task => task.id === taskId);
                        if (taskIndex !== -1) {
                            taskToMove = { ...newColumns[columnKey].items[taskIndex], status: newStatus };
                            sourceColumnKey = columnKey;
                            newColumns[columnKey] = {
                                ...newColumns[columnKey],
                                items: newColumns[columnKey].items.filter(task => task.id !== taskId),
                                totalCount: newColumns[columnKey].totalCount - 1
                            };
                        }
                    });

                    if (taskToMove) {
                        const targetColumnKey = getColumnKeyFromStatus(newStatus);
                        
                        if (newColumns[targetColumnKey]) {
                            newColumns[targetColumnKey] = {
                                ...newColumns[targetColumnKey],
                                items: [...newColumns[targetColumnKey].items, taskToMove],
                                totalCount: newColumns[targetColumnKey].totalCount + 1
                            };
                        } else {
                            console.warn(`Target column "${targetColumnKey}" not found for status "${newStatus}"`);
                            if (sourceColumnKey && newColumns[sourceColumnKey]) {
                                newColumns[sourceColumnKey] = {
                                    ...newColumns[sourceColumnKey],
                                    items: [...newColumns[sourceColumnKey].items, {...taskToMove, status: taskToMove.status}],
                                    totalCount: newColumns[sourceColumnKey].totalCount + 1
                                };
                            }
                        }
                    }

                    return {
                        ...oldData,
                        columns: newColumns
                    };
                })
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>) => {
                if(isKanbanResponse(oldData)) {
                    return updateKanbanData(oldData, (task: TaskDto) => task.id === data.id ? {...task, ...data} : task);
                }
                return oldData;
            })
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    })

    const removeTask = useMutation<string, Error, {id: number, userId: number}>(
        {
            mutationFn: async ({id, userId}) => await softDeleteTask(id, userId),
            onMutate: async ({id}: {id: number,  userId: number}) => {
                queryClient.cancelQueries({queryKey});
                const prevData = queryClient.getQueryData(queryKey);

                if(prevData) {
                    queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>)=> {
                        if(isInfiniteScrollResponse(oldData)) {
                            return updateInfiniteScrollData(oldData, (results) => results.filter((task: TaskDto) => task.id !== id));
                        } else if(isKanbanResponse(oldData)) {
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
            },
            onError: () => {
                queryClient.invalidateQueries({queryKey});
            }
        }
    )

    const {isLoading, isError, data, error} = useQuery<FlexibleResponse<TaskDto>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getTaskByView(viewMode,cursor, limit, auth?.id, year, month, sortDir, searchQuery, status, priority)
    });

    const loadMoreTasks = useCallback(async () => {
        if (isLoadingMore || !data || !isInfiniteScrollResponse(data) || !data.hasNextPage) {
            return;
        }

        setIsLoadingMore(true);
        
        try {
            const newData = await getTaskByView(
                viewMode,
                data.nextCursor,
                limit,
                auth?.id,
                year,
                month,
                sortDir,
                searchQuery,
                status,
                priority
            );

            if (isInfiniteScrollResponse(newData)) {
                // Update the query cache with merged data
                queryClient.setQueryData(queryKey, (oldData: FlexibleResponse<TaskDto>) => {
                    if (isInfiniteScrollResponse(oldData)) {
                        return {
                            ...oldData,
                            results: [...oldData.results, ...newData.results],
                            next_cursor: newData.nextCursor,
                            has_more: newData.hasNextPage
                        } as InfiniteScrollResponse<TaskDto>;
                    }
                    return oldData;
                });

                // Update local state
                setAllTasks(prev => [...prev, ...newData.results]);
                setCursor(newData.nextCursor || '');
            }
        } catch (error) {
            console.error('Error loading more tasks:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [data, isLoadingMore, viewMode, limit, auth?.id, year, month, sortDir, searchQuery, status, priority, queryKey]);

    const showTaskFormModal = (data: TaskDto  | null) => {
        if(data) {
            setTaskForm({
                id: data.id,
                userId: data.user_id,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                start_date: data.start_date,
                due_date: data.due_date,
                notify_at: data.notify_at
            })
        } else {
            setTaskForm(null);
        }
        setTaskFormModalOpen(true);
    }

    const closeTaskFormModal = () => {
        setTaskForm(null);
        setTaskFormModalOpen(false);
        
    }

    const showDeleteModal = (data: TaskDto) => {
        setDeleteTask(data);
        setDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        if(deleteTask) {
            await removeTask.mutateAsync({id: deleteTask.id, userId: deleteTask.user_id});
            closeDeleteModal();
        }
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    }

    const handleTaskFormSubmit = async (formData: upsertTaskDto) => {
        if(formData.id > 0) {
            await editTask.mutateAsync({
                data: formData, id: formData.id, userId: formData.userId
            })
        }
        else {
            const taskForm = {...formData, userId: auth?.id}
            await addTask.mutateAsync(taskForm as upsertTaskDto);
        }
        setTaskForm(null);
        closeTaskFormModal();
    }

    const handleTabChange = (value: ViewMode) => {
        setViewMode(value);
    };

    const handleUpdateTaskStatus = async (taskId: number, newStatus: TaskStatus, userId: number) => {
        await updateTaskStatus.mutateAsync({ taskId, newStatus, userId });
    };

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
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Task Board
                    </Typography>
                    <Typography sx={{ color: "#8A99AD", mt: 1, mb: 2, fontWeight: 400, fontSize: 17 }}>
                        Manage tasks and track progress for Yours Projects.
                    </Typography>
                </Box>
                
                <Box>
                    <Button variant="contained" color='primary' onClick={()=>showTaskFormModal(null)}>
                        Add New
                    </Button>
                </Box>
            </Box>

            <TaskTabNav activeTab={viewMode} onTabChange={handleTabChange} />

            <Box sx={{ borderBottom: 1, borderColor: "#EAEAEA", mt: 0.5, mb: 3 }} />

            <TaskFilters year={year} month={month} sortDir={sortDir} status={status} priority={priority} setYear={setYear} setMonth={setMonth} setSortDir={setSortDir} setStatus={setStatus} setPriority={setPriority} />
            
            <Box sx={{padding: 2}}>
                {
                    viewMode === 'list' &&
                    <TaskTableList taskList={data as InfiniteScrollResponse<TaskDto>} showViewDetail={showTaskFormModal} showDeleteModal={showDeleteModal} isLoadingMore={isLoadingMore} onLoadMore={loadMoreTasks} />
                }
                {
                    viewMode === 'board' &&
                    <KanbanBoard taskList={data as KanbanResponse<TaskDto>} showViewModal={showTaskFormModal} showDeleteModal={showDeleteModal} onUpdateTaskStatus={handleUpdateTaskStatus} />
                }
            </Box>
            <TaskDeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
            
            <TaskForm 
                open={isTaskFormModalOpen}
                onClose={closeTaskFormModal}
                onSubmit={handleTaskFormSubmit}
                defaultValue={taskForm}
            />
        </Box>
    )
}

export default TaskBoard;