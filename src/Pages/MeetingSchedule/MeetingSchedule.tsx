import { useState } from "react";
import { useThemeHook } from "../../Context/Theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type PaginationResponse, type sortDirection } from "../../dtos/responseDtos";
import { type MeetingScheduleDto, type upsertMeetingSchdeuleDto } from '../../dtos/meetingScheduleDtos';
import { createMeetingSchedule, getMeetingScheduleByPaging, softDeleteMeetingSchedule, updateMeetingSchedule } from "../../ApiRequestHelpers/meetingScheduleApiRequest";
import { queryClient } from "../../Hooks/QueryClient";
import { Alert, Box, Button, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import ICSDownloadButton from "../../Components/MeetingScheduleComponents/ICSDownloadButton";
import PopupModal from "../../Components/Modal";
import MeetingForm from "./MeetingForm";

const MeetingSchedule: React.FC = () => {
    const {auth} = useThemeHook();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortDir, setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalFormOpen, setModalFormOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [meetingForm, setMeetingForm] = useState<upsertMeetingSchdeuleDto | null>(null);
    const [deleteMeeting, setDeleteMeeting] = useState<MeetingScheduleDto | null>(null);

    const queryKey = ['meetings', page, pageSize, sortDir, searchQuery] as const;

    const {isLoading, isError, data, error} = useQuery<PaginationResponse<MeetingScheduleDto>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getMeetingScheduleByPaging(page, pageSize, auth.id, sortDir, searchQuery),
    });

    const addMeetingSchedule = useMutation<MeetingScheduleDto, Error, upsertMeetingSchdeuleDto>({
        mutationFn: async (data: upsertMeetingSchdeuleDto) => {
            const meetingWithUserId = {
                ...data,
                userId: auth?.id || 0
            }
            
            return await createMeetingSchedule(meetingWithUserId);
        },
        onMutate: async(newMeeting: upsertMeetingSchdeuleDto) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<MeetingScheduleDto>) => {
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
            queryClient.setQueryData(queryKey, (oldData: PaginationResponse<MeetingScheduleDto>) => {
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

    const editMeeting = useMutation<MeetingScheduleDto, Error, {data: upsertMeetingSchdeuleDto, id: number, userId: number}>({
        mutationFn: async ({data, id, userId}) => await updateMeetingSchedule(data, id, userId),
        onMutate: async ({data, id, userId}) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<MeetingScheduleDto>) => {
                    return {
                        ...oldData,
                        results: oldData.results.map((meeting: MeetingScheduleDto) => meeting.id === id && meeting.user_id === userId ? data : meeting)
                    }
                })
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, (oldData: PaginationResponse<MeetingScheduleDto>) => {
                return {
                    ...oldData,
                    results: oldData.results.map((meeting: MeetingScheduleDto) => meeting.id === data.id ? data : meeting)
                }
            });
            queryClient.invalidateQueries({queryKey});
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey});
        }
    });


    const removeMeeting = useMutation<string, Error, {id: number, userId: number}>({
        mutationFn: async ({id, userId}) => await softDeleteMeetingSchedule(id, userId),
        onMutate: async ({id, userId}) => {
            queryClient.cancelQueries({queryKey});
            const prevData = queryClient.getQueryData(queryKey);

            if(prevData) {
                queryClient.setQueryData(queryKey, (oldData: PaginationResponse<MeetingScheduleDto>) => {
                    return {
                        ...oldData,
                        results: oldData.results.filter((meeting: MeetingScheduleDto) => meeting.id !== id && meeting.user_id !== userId)
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

    const showModalForm = async (data: MeetingScheduleDto | null) => {
        if(data) {
            setMeetingForm({
                ...data,
                start_time: data.start_time ? new Date(data.start_time) : new Date(),
                end_time: data.end_time ? new Date(data.end_time) : new Date()
            })
        } else {
            setMeetingForm(null);
        }
        setModalFormOpen(true);
    }

    const closeModalForm = () => {
        setMeetingForm(null);
        setModalFormOpen(false);
    }

    const showDeleteModal = (data: MeetingScheduleDto) => {
        if(data) {
            setDeleteMeeting(data);
            setDeleteModalOpen(true);
        }
    }

    const handleDeleteModal = async () => {
        if(deleteMeeting != null) {
            await removeMeeting.mutateAsync({id: deleteMeeting.id, userId: deleteMeeting.user_id});
            setDeleteMeeting(null);
            closeDeleteModal();
        }
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    }

    const handleMeetingFormSubmit = async (data: upsertMeetingSchdeuleDto) => {
        
        if(data.id > 0) {
            await editMeeting.mutateAsync({data: data, id: data.id, userId: data.user_id});
        }
        else {
            const meetingForm = {...data, user_id: auth?.id || 0};
            await addMeetingSchedule.mutateAsync(meetingForm as upsertMeetingSchdeuleDto);
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
                <Typography variant="h4">Meeting Schedule</Typography>

                <Button variant="contained" color="primary" onClick={()=>showModalForm(null)}>Add Meeting</Button>
            </Box>

            <Paper elevation={0} sx={{borderRadius: 2, border: '1px solid #E7EAEE', p: 2}}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.results.map((meeting: MeetingScheduleDto) => (
                                <TableRow key={meeting.id}>
                                    <TableCell>{meeting.title}</TableCell>
                                    <TableCell>{dayjs(meeting.start_time).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(meeting.end_time).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>
                                        <ICSDownloadButton meetingId={meeting.id} userId={meeting.user_id} />
                                        <Button variant="text" 
                                        color="primary" 
                                        sx={{ mr: 1, ml: 1 }} onClick={()=>showModalForm(meeting)} >View Details</Button>
                                        <Button variant="text" 
                                        color="error" 
                                        sx={{ ml: 1 }} onClick={()=>showDeleteModal(meeting)}>Delete</Button>
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

            <MeetingForm 
                open={modalFormOpen} onClose={closeModalForm} onSubmit={handleMeetingFormSubmit} defaultValues={meetingForm}
            />

            <PopupModal open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteModal} title="Delete Meeting">
                <Typography>Are you sure you want to delte this meeting?</Typography>
            </PopupModal>
        </Box>
    )
}

export default MeetingSchedule;