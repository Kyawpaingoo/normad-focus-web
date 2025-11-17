import React, { useState } from "react";
import { useThemeHook } from "../../Context/Theme";
import type { PaginationResponse, sortDirection } from "../../dtos/responseDtos";
import type { countryLog, upsertCountryLog } from "../../dtos/countryLogDtos";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCountryLog, getCountryLogByPaging, hardDeleteCountryLog, updateCountryLog } from "../../ApiRequestHelpers/countryLogApiRequest";
import { queryClient } from "../../Hooks/QueryClient";
import dayjs from "dayjs";
import PopupModal from "../../Components/Modal";
import CountryLogForm from "./CountryLogForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const CountryLog: React.FC = () => {
    const {auth} = useThemeHook();
    const [page, setPage] = useState<number>(1);
    const [pageSize, _setPageSize] = useState<number>(10);
    const [sortDir, _setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, _setSearchQuery] = useState<string>('');
    const [modalFormOpen, setModalFormOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [counntryLogForm, setCountryLogForm] = useState<upsertCountryLog | null>(null);
    const [deleteCountryLog, setDeleteCountryLog] = useState<upsertCountryLog | null>(null);

    const queryKey = ['country-log', page, pageSize, sortDir, searchQuery] as const;

    const {isLoading, isError, data, error} = useQuery<PaginationResponse<countryLog>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getCountryLogByPaging(page, pageSize, auth?.id ?? 0, sortDir, searchQuery),
    });

    const addCountryLog = useMutation<countryLog, Error, upsertCountryLog>({
        mutationFn: async (data: upsertCountryLog) => {
            const dataWithUserId = {
                ...data,
                userId: auth?.id ?? 0
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
                const countryLogForm = {...data, user_id: auth?.id ?? 0};
                await addCountryLog.mutateAsync(countryLogForm as upsertCountryLog);
            }
            closeModalForm();
        }

    if(isLoading)
    {
        return (
            <div className="text-center p-4">
                Loading...
            </div>
        )
    }

    if(isError) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Country Log</h1>

                <Button onClick={()=>showModalForm(null)}>Add Country Log</Button>
            </div>

            <div className="rounded-lg border border-[#E7EAEE] p-4">
                <div className="overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Country Name</TableHead>
                                <TableHead>Visa Type</TableHead>
                                <TableHead>Visa Stays</TableHead>
                                <TableHead>Entry Date</TableHead>
                                <TableHead>Exit Date</TableHead>
                                <TableHead>Notify Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
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
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={()=>showModalForm(log)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={()=>showDeleteModal(log)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {page} of {data?.totalPage}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data?.totalPage}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(data?.totalPage || 1)}
                        disabled={page === data?.totalPage}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CountryLogForm
                open={modalFormOpen} onClose={closeModalForm} onSubmit={handleCountryLogFormSubmit} defaultValues={counntryLogForm}
            />

            <PopupModal open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteModal} title="Delete Country Log">
                <p>Are you sure you want to delete this country log?</p>
            </PopupModal>
        </div>
    )
}

export default CountryLog