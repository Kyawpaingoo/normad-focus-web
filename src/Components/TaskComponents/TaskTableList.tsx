import type React from "react";
import type { InfiniteScrollResponse } from "../../dtos/responseDtos";
import type { TaskDto } from "../../dtos/taskDto";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { getTablePriorityBackgroundColor, getTablePriorityColor, getTableStatusBackgroundColor, getTableStatusColor, getTaskDateFormat } from "../../Ultils/Helper";

interface TaskTableListProps {
    taskList: InfiniteScrollResponse<TaskDto>;   
    showViewDetail: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
    onLoadMore: () => Promise<void>;
    isLoadingMore: boolean;
}

const TaskTableList: React.FC<TaskTableListProps> = ({taskList, showViewDetail, showDeleteModal, onLoadMore, isLoadingMore}) => {
    const results = taskList?.results ?? [];
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const loadingTriggerRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if(target.isIntersecting && taskList?.hasNextPage && !isLoadingMore) {
            onLoadMore();
        }
    }, [taskList?.hasNextPage, isLoadingMore, onLoadMore]);

    useEffect(()=> {
        const observer = new IntersectionObserver(handleObserver, {
            root: tableContainerRef.current,
            rootMargin: '100px',
            threshold: 0.1,
        });

        const currentTrigger = loadingTriggerRef.current;
        if(currentTrigger) {
            observer.observe(currentTrigger);
        }

        return () => {
            if(currentTrigger) {
                observer.unobserve(currentTrigger);
            }
        }
    }, [handleObserver]);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const {scrollTop, scrollHeight, clientHeight} = event.currentTarget;

        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        if(scrollPercentage > 0.8 && taskList?.hasNextPage && !isLoadingMore) {
            onLoadMore();
        }
    }, [taskList?.hasNextPage, isLoadingMore, onLoadMore]);

    if(!results.length) {
        return (
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    border: "1px solid #E7EAEE",
                    boxShadow: "none",
                    mt: 1,
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No tasks found
                </Typography>
            </TableContainer>
        )
    }

    return (
        <TableContainer
            ref={tableContainerRef}
            onScroll={handleScroll}
            component={Paper}
             sx={{
                borderRadius: 2,
                border: "1px solid #E7EAEE",
                boxShadow: "none",
                mt: 1,
                minHeight: 300
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: 600, backgroundColor: '#f5f5f5'}}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Start Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((data: TaskDto, index: number) => (
                        <TableRow 
                            key={`${data.id}-${index}`}
                            hover
                            sx={{ 
                                '&:nth-of-type(odd)': { 
                                    backgroundColor: '#fafafa' 
                                },
                                '&:hover': {
                                    backgroundColor: '#f0f0f0'
                                }
                            }}
                        >
                            <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {data.title}
                            </TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        backgroundColor: 
                                            getTableStatusBackgroundColor(data.status),
                                        color:
                                            getTableStatusColor(data.status),
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        textAlign: 'center',
                                        minWidth: 70,
                                        display: 'inline-block'
                                    }}
                                >
                                    {data.status}
                                </Box>
                            </TableCell>
                            <TableCell>
                                {getTaskDateFormat(data.start_date)}
                            </TableCell>
                            <TableCell>
                                {getTaskDateFormat(data.due_date)}
                            </TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        backgroundColor: 
                                            getTablePriorityBackgroundColor(data.priority),
                                        color:
                                            getTablePriorityColor(data.priority),
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        textAlign: 'center',
                                        minWidth: 60,
                                        display: 'inline-block'
                                    }}
                                >
                                    {data.priority}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small"
                                        onClick={() => showViewDetail(data)}
                                        sx={{ minWidth: 80 }}
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        size="small"
                                        onClick={() => showDeleteModal(data)}
                                        sx={{ minWidth: 80 }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div ref={loadingTriggerRef} style={{ height: '20px' }} />

            {isLoadingMore && (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        p: 2,
                        borderTop: '1px solid #E7EAEE'
                    }}
                >
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        Loading more tasks...
                    </Typography>
                </Box>
            )}

            {!taskList?.hasNextPage && results.length > 0 && (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        p: 2,
                        borderTop: '1px solid #E7EAEE',
                        backgroundColor: '#fafafa'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No more tasks to load
                    </Typography>
                </Box>
            )}
        </TableContainer>
    )
}

export default TaskTableList