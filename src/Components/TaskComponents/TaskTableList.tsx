import type React from "react";
import type { InfiniteScrollResponse } from "../../dtos/responseDtos";
import type { TaskDto } from "../../dtos/taskDto";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";

interface TaskTableListProps {
    taskList: InfiniteScrollResponse<TaskDto>;   
    showViewDetail: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
}

const TaskTableList: React.FC<TaskTableListProps> = ({taskList, showViewDetail, showDeleteModal}) => {
    const results = taskList?.results ?? [];

    return (
        <TableContainer
            component={Paper}
             sx={{
                borderRadius: 2,
                border: "1px solid #E7EAEE",
                boxShadow: "none",
                mt: 1,
                minHeight: 300
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: 600}}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((data: TaskDto, index: number)=> (
                        <TableRow key={index}>
                            <TableCell>{data.title}</TableCell>
                            <TableCell>{data.status}</TableCell>
                            <TableCell>{dayjs(data.start_date).format('YYYY-MM-DD')}</TableCell>
                            <TableCell>{dayjs(data.due_date).format('YYYY-MM-DD')}</TableCell>
                            <TableCell>{data.priority}</TableCell>
                            <TableCell>
                                
                                <Button variant="contained" color="primary" sx={{mr: 1}} onClick={()=>showViewDetail(data)}>
                                    View Detail
                                </Button>
                                <Button variant="contained" color="error" sx={{ml: 1}} onClick={()=>showDeleteModal(data)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TaskTableList