import type React from "react";
import type { InfiniteScrollResponse } from "../../dtos/responseDtos";
import type { TaskDto } from "../../dtos/taskDto";
import { useCallback, useEffect, useRef } from "react";
import { getTablePriorityBackgroundColor, getTablePriorityColor, getTableStatusBackgroundColor, getTableStatusColor, getTaskDateFormat } from "../../Ultils/Helper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
            <div className="rounded-lg border border-[#E7EAEE] mt-1 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                    No tasks found
                </p>
            </div>
        )
    }

    return (
        <div
            ref={tableContainerRef}
            onScroll={handleScroll}
            className="rounded-lg border border-[#E7EAEE] mt-1 min-h-[300px] overflow-auto"
        >
            <Table>
                <TableHeader className="sticky top-0 bg-[#f5f5f5]">
                    <TableRow>
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Start Date</TableHead>
                        <TableHead className="font-semibold">Due Date</TableHead>
                        <TableHead className="font-semibold">Priority</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((data: TaskDto, index: number) => (
                        <TableRow
                            key={`${data.id}-${index}`}
                            className="odd:bg-[#fafafa] hover:bg-[#f0f0f0]"
                        >
                            <TableCell className="max-w-[200px] overflow-hidden text-ellipsis">
                                {data.title}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className="min-w-[70px] justify-center"
                                    style={{
                                        backgroundColor: getTableStatusBackgroundColor(data.status),
                                        color: getTableStatusColor(data.status)
                                    }}
                                >
                                    {data.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {getTaskDateFormat(data.start_date)}
                            </TableCell>
                            <TableCell>
                                {getTaskDateFormat(data.due_date)}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className="min-w-[60px] justify-center"
                                    style={{
                                        backgroundColor: getTablePriorityBackgroundColor(data.priority),
                                        color: getTablePriorityColor(data.priority)
                                    }}
                                >
                                    {data.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => showViewDetail(data)}
                                        className="min-w-[80px]"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => showDeleteModal(data)}
                                        className="min-w-[80px]"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div ref={loadingTriggerRef} style={{ height: '20px' }} />

            {isLoadingMore && (
                <div className="flex justify-center items-center p-4 border-t border-[#E7EAEE]">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <p className="text-sm text-muted-foreground">
                        Loading more tasks...
                    </p>
                </div>
            )}

            {!taskList?.hasNextPage && results.length > 0 && (
                <div className="flex justify-center items-center p-4 border-t border-[#E7EAEE] bg-[#fafafa]">
                    <p className="text-sm text-muted-foreground">
                        No more tasks to load
                    </p>
                </div>
            )}
        </div>
    )
}

export default TaskTableList