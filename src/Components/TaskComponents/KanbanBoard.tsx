import type React from "react";
import type { KanbanResponse } from "../../dtos/responseDtos";
import type { TaskDto, TaskStatus } from "../../dtos/taskDto";
import { useState } from "react";
import { getKanbanPriorityColor as _getKanbanPriorityColor, getStatusFromColumnKey, getTaskDateFormat } from "../../Ultils/Helper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Calendar, GripVertical, MoreVertical } from "lucide-react";

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



const TaskCardMenu: React.FC<TaskCareMenuProps> = ({task, showViewModal, showDeleteModal}) => {
    const handleEditMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        showViewModal(task);
    }

    const handleDeleteMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        showDeleteModal(task);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditMenu}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteMenu}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
        <Card
            draggable
            onDragStart={handleDragStart}
            onClick={handleClick}
            className={`my-2 transition-all duration-200 ${
                isDragging
                    ? 'cursor-move opacity-80 rotate-[5deg] shadow-lg'
                    : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
            }`}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <GripVertical className="h-4 w-4 opacity-30 hover:opacity-70 cursor-grab" />
                    <p className="text-sm font-medium flex-1 mx-2">
                        {task.title || 'Untitled Task'}
                    </p>
                    <TaskCardMenu task={task} showViewModal={showViewModal} showDeleteModal={showDeleteModal} />
                </div>

                <div className="flex justify-between items-center mb-2">
                    <Badge
                        variant="outline"
                        className={`${
                            task.priority === 'High' ? 'border-red-500 text-red-500' :
                            task.priority === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                            'border-gray-500 text-gray-500'
                        }`}
                    >
                        {task.priority || 'none'}
                    </Badge>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {getTaskDateFormat(task.due_date)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const KanbanColumn: React.FC<KanbanColumnProps> =({title, tasks, totalCount, onDrop, onDragOver, onDragStart, status, draggedTask, isDragOver, showViewModal, showDeleteModal, onAddTask}) => {
    return (
        <div
            className={`p-4 min-h-[500px] w-80 transition-all duration-200 rounded-lg ${
                isDragOver
                    ? 'bg-accent border-2 border-dashed border-primary'
                    : 'bg-background border border-[#EAEAEA]'
            }`}
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold pr-2">
                        {title}
                    </h3>
                    <Badge variant="default">{totalCount}</Badge>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => onAddTask(status)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add new task</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div>
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
            </div>
        </div>
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
        <div className="flex gap-6 overflow-x-auto pb-4">
            {Object.entries(columns).map(([columnKey, column]) => {
                const status = getStatusFromColumnKey(columnKey);

                return(
                    <div
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
                    </div>
                )
            })}
        </div>
    )
};

export default KanbanBoard;