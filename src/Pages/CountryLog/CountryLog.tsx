import React, { useState } from "react";
import { useThemeHook } from "../../Context/Theme";
import type { PaginationResponse, sortDirection } from "../../dtos/responseDtos";
import type { countryLog, upsertCountryLog } from "../../dtos/countryLogDtos";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCountryLog, getCountryLogByPaging, hardDeleteCountryLog, updateCountryLog } from "../../ApiRequestHelpers/countryLogApiRequest";
import { Alert, Box, Button, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { queryClient } from "../../Hooks/QueryClient";
import dayjs from "dayjs";
import PopupModal from "../../Components/Modal";
import CountryLogForm from "./CountryLogForm";

const CountryLog: React.FC = () => {
    const {auth} = useThemeHook();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortDir, setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalFormOpen, setModalFormOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [counntryLogForm, setCountryLogForm] = useState<upsertCountryLog | null>(null);
    const [deleteCountryLog, setDeleteCountryLog] = useState<upsertCountryLog | null>(null);

    const queryKey = ['country-log', page, pageSize, sortDir, searchQuery] as const;

    const {isLoading, isError, data, error} = useQuery<PaginationResponse<countryLog>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getCountryLogByPaging(page, pageSize, auth.id, sortDir, searchQuery),
    });

    const addCountryLog = useMutation<countryLog, Error, upsertCountryLog>({
        mutationFn: async (data: upsertCountryLog) => {
            const dataWithUserId = {
                ...data,
                userId: auth?.id || 0
            }
            
            return await createCountryLog(dataWithUserId);
        },
        onMutate: async(newMeeting: upsertCountryLog) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<countryLog>) => {
                    return {
                        ...oldData,
                        results: [{
                            ...newMeeting, id: Date.now()
                        },
                        ...oldData.results
                    ]
                    }
                })
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, (oldData: PaginationResponse<countryLog>) => {
                return {
                    ...oldData,
                    results: [...oldData.results, data]
                }
            });

            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    });

    const editCountryLog = useMutation<countryLog, Error, {data: upsertCountryLog, id: number, userId: number}>({
        mutationFn: async ({data, id, userId}) => await updateCountryLog(data, id, userId),
        onMutate: async ({data, id, userId}) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<countryLog>) => {
                    return {
                        ...oldData,
                        results: oldData.results.map((log: countryLog) => log.id === id && log.user_id === userId ? data : log)
                    }
                })
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, (oldData: PaginationResponse<countryLog>) => {
                return {
                    ...oldData,
                    results: oldData.results.map((log: countryLog) => log.id === data.id ? data : log)
                }
            });
            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    });


    const removeCountryLog = useMutation<string, Error, {id: number, userId: number}>({
        mutationFn: async ({id, userId}) => await hardDeleteCountryLog(id, userId),
        onMutate: async ({id, userId}) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<countryLog>) => {
                    return {
                        ...oldData,
                        results: oldData.results.filter((log: countryLog) => log.id !== id && log.user_id !== userId)
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
    });

     const showModalForm = async (data: countryLog | null) => {
            if(data) {
                setCountryLogForm({
                    ...data,
                    entry_date: data.entry_date ? new Date(data.entry_date) : new Date(),
                    exit_date: data.exit_date ? new Date(data.exit_date) : new Date()
                })
            } else {
                setCountryLogForm(null);
            }
            setModalFormOpen(true);
        }
    
        const closeModalForm = () => {
            setCountryLogForm(null);
            setModalFormOpen(false);
        }
    
        const showDeleteModal = (data: countryLog) => {
            if(data) {
                setDeleteCountryLog(data);
                setDeleteModalOpen(true);
            }
        }
    
        const handleDeleteModal = async () => {
            if(deleteCountryLog != null) {
                await removeCountryLog.mutateAsync({id: deleteCountryLog.id, userId: deleteCountryLog.user_id});
                setDeleteCountryLog(null);
                closeDeleteModal();
            }
        }
    
        const closeDeleteModal = () => {
            setDeleteModalOpen(false);
        }
    
        const handleCountryLogFormSubmit = async (data: upsertCountryLog) => {
            
            if(data.id > 0) {
                await editCountryLog.mutateAsync({data: data, id: data.id, userId: data.user_id});
            }
            else {
                const countryLogForm = {...data, user_id: auth?.id || 0};
                await addCountryLog.mutateAsync(countryLogForm as upsertCountryLog);
            }
            closeModalForm();
        }

    if(isLoading)
    {
        return (
        <Box sx={{ textAlign: 'center'}}>
            Loading...
        </Box>
        )
    }

    if(isError) {
        return (
            <Box>
                <Alert severity='warning'>{error.message}</Alert>
            </Box>
        )
    }

    return (
        <Box sx={{p: 4, minHeight: '100vh'}}>
            <Box mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4">Country Log</Typography>

                <Button variant="contained" color="primary" onClick={()=>showModalForm(null)}>Add Meeting</Button>
            </Box>

            <Paper elevation={0} sx={{borderRadius: 2, border: '1px solid #E7EAEE', p: 2}}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Country Name</TableCell>
                                <TableCell>Visa Type</TableCell>
                                <TableCell>Visa Stays</TableCell>
                                <TableCell>Entry Date</TableCell>
                                <TableCell>Exit Date</TableCell>
                                <TableCell>Notify Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.results.map((log: countryLog) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.country_name}</TableCell>
                                    <TableCell>{log.visa_type}</TableCell>
                                    <TableCell>{log.visa_limit_days}</TableCell>
                                    <TableCell>{dayjs(log.entry_date).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(log.exit_date).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(log.notify_at).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>
                                        <Button variant="text" 
                                        color="primary" 
                                        sx={{ mr: 1, ml: 1 }} onClick={()=>showModalForm(log)} >View Details</Button>
                                        <Button variant="text" 
                                        color="error" 
                                        sx={{ ml: 1 }} onClick={()=>showDeleteModal(log)}>Delete</Button>
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

            <CountryLogForm
                open={modalFormOpen} onClose={closeModalForm} onSubmit={handleCountryLogFormSubmit} defaultValues={counntryLogForm}
            />

            <PopupModal open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteModal} title="Delete Meeting">
                <Typography>Are you sure you want to delte this meeting?</Typography>
            </PopupModal>
        </Box>
    )
}

export default CountryLog