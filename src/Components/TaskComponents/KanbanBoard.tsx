import type React from "react";
import type { KanbanResponse } from "../../dtos/responseDtos";
import type { TaskDto, TaskStatus } from "../../dtos/taskDto";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Paper,
    Tooltip,
    Badge,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Add,
    CalendarToday,
    DragIndicator,
    MoreVert
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { getKanbanPriorityColor, getStatusFromColumnKey, getTaskDateFormat } from "../../Ultils/Helper";

interface KanbanBoardProps {
    taskList: KanbanResponse<TaskDto>
    showViewModal: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
    onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus, userId: number) => void;
}

interface TaskCareMenuProps {
    task: TaskDto;
    showViewModal: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
}

interface TaskCradProps {
    task: TaskDto,
    onDragStart: (e: React.DragEvent, task: TaskDto) => void;
    isDragging: boolean
    showViewModal: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
}

interface KanbanColumnProps {
    title: string;
    tasks: TaskDto[];
    totalCount: number;
    onDrop: (e: React.DragEvent, status: TaskStatus) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (e: React.DragEvent, task: TaskDto) => void;
    status: TaskStatus;
    draggedTask: TaskDto | null;
    isDragOver: boolean;
    showViewModal: (data: TaskDto | null) => void;
    showDeleteModal: (data: TaskDto) => void;
    onAddTask: (status: TaskStatus) => void;
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
    border: isDragOver ? `2px dashed ${theme.palette.primary.main}` : '1px solid #EAEAEA',
}));


const TaskCardMenu: React.FC<TaskCareMenuProps> = ({task, showViewModal, showDeleteModal}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }

    const handleClose = (event?: React.MouseEvent) => {
        if (event) event?.stopPropagation();
        setAnchorEl(null);
    }

    const handleEditMenu = (event: React.MouseEvent, taskData: TaskDto | null) => {
        event.stopPropagation();
        showViewModal(taskData);
        handleClose();
    }

    const handleDeleteMenu = (event: React.MouseEvent, taskData: TaskDto) => {
        event.stopPropagation();
        showDeleteModal(taskData);
        handleClose();
    }

    return (
        <>
            <IconButton id="task-card-menu-button" size="small" sx={{ padding: 0.5 }} aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                <MoreVert />
            </IconButton>
            <Menu
                id="task-card-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                 slotProps={{
                    list: {
                        'aria-labelledby': 'task-card-menu-button',
                    },
                }}
            >
                <MenuItem onClick={(e) => handleEditMenu(e, task)}>Edit</MenuItem>
                <MenuItem onClick={(e) => handleDeleteMenu(e, task)}>Delete</MenuItem>
            </Menu>
        </>
    )
}

const TaskCard: React.FC<TaskCradProps> = ({task, onDragStart, isDragging, showViewModal, showDeleteModal}) => {

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify(task));
        e.dataTransfer.setData('text/plain', task.id.toString());
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(e, task);
    }

    const handleClick = (e: React.MouseEvent) => {
        if(isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        showViewModal(task);
    }
    return(
        <TaskCardStyled
            draggable
            onDragStart={handleDragStart}
            isDragging={isDragging}
            elevation={isDragging ? 6 : 2}
            onClick={handleClick}
        >
            <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                    <DragIndicatorStyled fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="medium" sx={{ flex: 1, mx: 1 }}>
                        {task.title || 'Untitled Task'}
                    </Typography>
                    <TaskCardMenu task={task} showViewModal={showViewModal} showDeleteModal={showDeleteModal} />
                </Box>
                    
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip
                        label={task.priority || 'none'}
                        color={getKanbanPriorityColor(task.priority)}
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
                            {getTaskDateFormat(task.due_date)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </TaskCardStyled>
    )
}

const KanbanColumn: React.FC<KanbanColumnProps> =({title, tasks, totalCount, onDrop, onDragOver, onDragStart, status, draggedTask, isDragOver, showViewModal, showDeleteModal, onAddTask}) => {
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
                    <IconButton size="small" color="primary" onClick={() => onAddTask(status)}>
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
                    showDeleteModal={showDeleteModal}
                />
                ))}
            </Box>
        </ColumnPaper>
    );
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({taskList, showViewModal, showDeleteModal, onUpdateTaskStatus}) => {
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

    const handleDragEnter = (columnKey: string) => {
        setDragOverColumn(columnKey);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        setDragOverColumn(null);
        
        if (!draggedTask) {
            try {
                const taskData = e.dataTransfer.getData('application/json');
                if (taskData) {
                    const task = JSON.parse(taskData) as TaskDto;
                    if (task.status !== newStatus) {
                        onUpdateTaskStatus(task.id, newStatus, task.user_id);
                    }
                }
            } catch (error) {
                console.error('Failed to parse dragged task data:', error);
            }
            return;
        }

        if (draggedTask.status === newStatus) {
            setDraggedTask(null);
            return;
        }

        try {
            onUpdateTaskStatus(draggedTask.id, newStatus, draggedTask.user_id);
        } catch (error) {
            console.error('Failed to update task status:', error);
        } finally {
            setDraggedTask(null);
        }
    }

     const handleAddTask = (status: TaskStatus) => {
        const newTask: Partial<TaskDto> = {
            id: 0, 
            title: '',
            description: '',
            status: status,
            priority: 'Low',
            due_date: new Date(),
            user_id: 0, 
            created_at: new Date(),
        };
        
        showViewModal(newTask as TaskDto);
    }

    return (
        <Box display="flex" gap={3} sx={{ overflowX: 'auto', pb: 2 }}>
            {Object.entries(columns).map(([columnKey, column]) => {
                const status = getStatusFromColumnKey(columnKey);

                return(
                    <Box
                        key={columnKey}
                        onDragEnter={() => handleDragEnter(columnKey)}
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
                            isDragOver={dragOverColumn === columnKey}
                            showViewModal={showViewModal}
                            showDeleteModal={showDeleteModal}
                            onAddTask={handleAddTask}
                        />
                    </Box>
                )
            })}
        </Box>
    )
};

export default KanbanBoard;