import type React from "react";
import type { KanbanResponse } from "../../dtos/responseDtos";
import type { TaskDto } from "../../dtos/taskDto";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  CalendarToday,
  DragIndicator,
  MoreVert
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dayjs from "dayjs";
import { useState } from "react";

interface KanbanBoardProps {
    taskList: KanbanResponse<TaskDto>
    showViewModal: (data: TaskDto | null) => void;
}

interface TaskCradProps {
    task: TaskDto,
    onDragStart: (e: React.DragEvent, task: TaskDto) => void;
    isDragging: boolean
    showViewModal: (data: TaskDto | null) => void;
}

interface KanbanColumnProps {
    title: string;
    tasks: TaskDto[];
    totalCount: number;
    onDrop: (e: React.DragEvent, status: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (e: React.DragEvent, task: TaskDto) => void;
    status: string;
    draggedTask: TaskDto | null;
    isDragOver: boolean;
    showViewModal: (data: TaskDto | null) => void;
}

interface TaskCardStyledProps {
    isDragging?: boolean;
}

interface ColumnPaperProps {
    isDragOver?: boolean;
}

const DragIndicatorStyled = styled(DragIndicator)(({ theme }) => ({
    opacity: 0.3,
    cursor: 'grab',
    '&:hover': {
        opacity: 0.7,
    },
}));

const TaskCardStyled = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})<TaskCardStyledProps>(({ theme, isDragging }) => ({
    cursor: isDragging ? 'move' : 'pointer',
    margin: theme.spacing(1, 0),
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    transform: isDragging ? 'rotate(5deg)' : 'none',
    '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)',
    },
}));

const ColumnPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragOver',
})<ColumnPaperProps>(({ theme, isDragOver }) => ({
    padding: theme.spacing(2),
    minHeight: '500px',
    width: '320px',
    backgroundColor: isDragOver ? theme.palette.action.hover : theme.palette.background.default,
    transition: 'background-color 0.2s ease',
    border: isDragOver ? `2px dashed ${theme.palette.primary.main}` : '1px solid transparent',
}));

const getPriorityColor = (priority: string | null) => {
    switch (priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'default';
    }
};

const TaskCard: React.FC<TaskCradProps> = ({task, onDragStart, isDragging, showViewModal}) => {
    return(
        <TaskCardStyled
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            isDragging={isDragging}
            elevation={isDragging ? 6 : 2}
            onClick={()=> showViewModal(task)}
        >
            <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                    <DragIndicatorStyled fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="medium" sx={{ flex: 1, mx: 1 }}>
                        {task.title || 'Untitled Task'}
                    </Typography>
                    <IconButton size="small" sx={{ padding: 0.5 }}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>
                    
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip
                        label={task.priority || 'none'}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        variant="outlined"
                    />
                </Box>
                    
                {task.description && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                        mb: 2, 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {task.description}
                    </Typography>
                )}
                    
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {dayjs(task.due_date).format('YYYY-MM-DD')}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </TaskCardStyled>
    )
}

const KanbanColumn: React.FC<KanbanColumnProps> =({title, tasks, totalCount, onDrop, onDragOver, onDragStart, status, draggedTask, isDragOver, showViewModal}) => {
    return (
        <ColumnPaper
            elevation={1}
            isDragOver={isDragOver}
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" fontWeight="bold" sx={{paddingRight:2}}>
                        {title}
                    </Typography>
                    <Badge badgeContent={totalCount} color="primary" />
                </Box>
                <Tooltip title="Add new task">
                    <IconButton size="small" color="primary">
                        <Add />
                    </IconButton>
                </Tooltip>
            </Box>
      
            <Box>
                {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={onDragStart}
                    isDragging={draggedTask?.id === task.id}
                    showViewModal={showViewModal}
                />
                ))}
            </Box>
        </ColumnPaper>
    );
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({taskList, showViewModal}) => {
    const [draggedTask, setDraggedTask] = useState<TaskDto | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const columns = taskList?.columns ?? [];

    const handleDragStart = (e: React.DragEvent, task: TaskDto) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (status: string) => {
        setDragOverColumn(status);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        
        // if (!draggedTask || !kanbanData) return;

        // const updatedTask = { ...draggedTask, status: newStatus };
        
        // Create new kanban data with updated task
        //const newKanbanData = { ...kanbanData };
        
        // Remove task from old column
        // Object.keys(newKanbanData.columns).forEach(columnKey => {
        //     newKanbanData.columns[columnKey].items = newKanbanData.columns[columnKey].items.filter(
        //         task => task.id !== draggedTask.id
        //     );
        //     newKanbanData.columns[columnKey].totalCount = newKanbanData.columns[columnKey].items.length;
        // });
        
        // // Add task to new column
        // if (newKanbanData.columns[newStatus]) {
        //     newKanbanData.columns[newStatus].items.push(updatedTask);
        //     newKanbanData.columns[newStatus].totalCount = newKanbanData.columns[newStatus].items.length;
        // }
        
        // setKanbanData(newKanbanData);
        setDraggedTask(null);
    }
    return (
        <Box display="flex" gap={3} sx={{ overflowX: 'auto', pb: 2 }}>
            {Object.entries(columns).map(([status, column]) => (
                <Box
                    key={status}
                    onDragEnter={() => handleDragEnter(status)}
                    onDragLeave={handleDragLeave}
                >
                    <KanbanColumn
                        title={column.title}
                        tasks={column.items}
                        totalCount={column.totalCount}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragStart={handleDragStart}
                        status={status}
                        draggedTask={draggedTask}
                        isDragOver={dragOverColumn === status}
                        showViewModal={showViewModal}
                    />
                </Box>
            ))}
        </Box>
    )
};


export default KanbanBoard;