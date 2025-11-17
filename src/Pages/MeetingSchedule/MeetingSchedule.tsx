import { useState } from "react";
import { useThemeHook } from "../../Context/Theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type PaginationResponse, type sortDirection } from "../../dtos/responseDtos";
import { type MeetingScheduleDto, type upsertMeetingSchdeuleDto } from '../../dtos/meetingScheduleDtos';
import { createMeetingSchedule, getMeetingScheduleByPaging, softDeleteMeetingSchedule, updateMeetingSchedule } from "../../ApiRequestHelpers/meetingScheduleApiRequest";
import { queryClient } from "../../Hooks/QueryClient";
import dayjs from "dayjs";
import ICSDownloadButton from "../../Components/MeetingScheduleComponents/ICSDownloadButton";
import PopupModal from "../../Components/Modal";
import MeetingForm from "./MeetingForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const MeetingSchedule: React.FC = () => {
    const {auth} = useThemeHook();
    const [page, setPage] = useState<number>(1);
    const [pageSize, _setPageSize] = useState<number>(10);
    const [sortDir, _setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, _setSearchQuery] = useState<string>('');
    const [modalFormOpen, setModalFormOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [meetingForm, setMeetingForm] = useState<upsertMeetingSchdeuleDto | null>(null);
    const [deleteMeeting, setDeleteMeeting] = useState<MeetingScheduleDto | null>(null);

    const queryKey = ['meetings', page, pageSize, sortDir, searchQuery] as const;

    const {isLoading, isError, data, error} = useQuery<PaginationResponse<MeetingScheduleDto>, Error>({
        queryKey: queryKey,
        queryFn: async () => await getMeetingScheduleByPaging(page, pageSize, auth?.id ?? 0, sortDir, searchQuery),
    });

    const addMeetingSchedule = useMutation<MeetingScheduleDto, Error, upsertMeetingSchdeuleDto>({
        mutationFn: async (data: upsertMeetingSchdeuleDto) => {
            const meetingWithUserId = {
                ...data,
                userId: auth?.id ?? 0
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
            const meetingForm = {...data, user_id: auth?.id ?? 0};
            await addMeetingSchedule.mutateAsync(meetingForm as upsertMeetingSchdeuleDto);
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
                <h1 className="text-3xl font-bold">Meeting Schedule</h1>

                <Button onClick={()=>showModalForm(null)}>Add Meeting</Button>
            </div>

            <div className="rounded-lg border border-[#E7EAEE] p-4">
                <div className="overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.results.map((meeting: MeetingScheduleDto) => (
                                <TableRow key={meeting.id}>
                                    <TableCell>{meeting.title}</TableCell>
                                    <TableCell>{dayjs(meeting.start_time).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(meeting.end_time).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ICSDownloadButton meetingId={meeting.id} userId={meeting.user_id} />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={()=>showModalForm(meeting)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={()=>showDeleteModal(meeting)}
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

            <MeetingForm
                open={modalFormOpen} onClose={closeModalForm} onSubmit={handleMeetingFormSubmit} defaultValues={meetingForm}
            />

            <PopupModal open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteModal} title="Delete Meeting">
                <p>Are you sure you want to delete this meeting?</p>
            </PopupModal>
        </div>
    )
}

export default MeetingSchedule;