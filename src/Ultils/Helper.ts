import dayjs from 'dayjs';
import { type FlexibleResponse, type InfiniteScrollResponse, type KanbanResponse } from '../dtos/responseDtos';
import type { TaskDto, TaskStatus } from '../dtos/taskDto';
export function getMonthYearString(date: Date) {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
}

export function updateInfiniteScrollData(
    oldData: InfiniteScrollResponse<TaskDto>,
    updater: (results: TaskDto[]) => TaskDto[]
): InfiniteScrollResponse<TaskDto> {
    return {
        ...oldData,
        results: updater(oldData.results)
    };
}

export function updateKanbanData (
    oldData: KanbanResponse<TaskDto>,
    updater: (task: TaskDto) => TaskDto,
    taskId?: number,
    newTask?: TaskDto
): KanbanResponse<TaskDto> {
    const updatedColumns = { ...oldData.columns };

    if (newTask) {
        const defaultColumnKey = Object.keys(updatedColumns).find(
            key => updatedColumns[key].title === 'To Do'
        ) || Object.keys(updatedColumns)[0];

        if (updatedColumns[defaultColumnKey]) {
            updatedColumns[defaultColumnKey] = {
                ...updatedColumns[defaultColumnKey],
                items: [newTask, ...updatedColumns[defaultColumnKey].items],
                totalCount: updatedColumns[defaultColumnKey].totalCount + 1
            };
        }
    } else if (taskId) {
        Object.keys(updatedColumns).forEach(columnKey => {
            updatedColumns[columnKey] = {
                ...updatedColumns[columnKey],
                items: updatedColumns[columnKey].items.map(task =>
                    task.id === taskId ? updater(task) : task
                )
            };
        });
    }

    return {
        ...oldData,
        columns: updatedColumns
    };
};

export function isInfiniteScrollResponse <T>(data: FlexibleResponse<T>): data is InfiniteScrollResponse<T> {
    return 'results' in data && 'nextCursor' in data && 'hasNextPage' in data;
}

export function isKanbanResponse <T>(data: FlexibleResponse<T>): data is KanbanResponse<T>  {
    return 'columns' in data && 'totalCount' in data;
}

export function getKanbanPriorityColor (priority: string | null) {
    switch (priority) {
        case 'High': return 'error';
        case 'Medium': return 'warning';
        case 'Low': return 'success';
        default: return 'success';
    }
}

export function getTableStatusColor (status: TaskStatus) {
    switch (status) {
        case 'To Do': return '#721c24';
        case 'In Progress': return '#856404';
        case 'Done': return '#2e7d32';
        default: return '#721c24';
    }
}

export function getTableStatusBackgroundColor (status: TaskStatus) {
    switch (status) {
        case 'To Do': return '#f8d7da';
        case 'In Progress': return '#fff3cd';
        case 'Done': return '#e8f5e8';
        default: return '#f8d7da';
    }
}

export function getTablePriorityColor (priority: string | null) {
    switch (priority) {
        case 'High': return '#c62828';
        case 'Medium': return '#f57c00';
        case 'Low': return '#1565c0';
        default: return '#1565c0';
    }
}

export function getTablePriorityBackgroundColor (priority: string | null) {
    switch (priority) {
        case 'High': return '#ffebee';
        case 'Medium': return '#fff8e1';
        case 'Low': return '#e3f2fd';
        default: return '#e3f2fd';
    }
}

export function getStatusFromColumnKey (columnKey: string): TaskStatus {
    switch (columnKey) {
        case 'todo': return 'To Do';
        case 'in_progress': return 'In Progress';
        case 'done': return 'Done';
        default: return columnKey as TaskStatus;
    }
}

export const getColumnKeyFromStatus = (status: TaskStatus): string => {
    switch (status) {
        case 'To Do': return 'todo';
        case 'In Progress': return 'in_progress';
        case 'Done': return 'done';
    }
};

export function getTaskDateFormat (date: Date | null): string {
    return date ? dayjs(date).format('YYYY-MM-DD') : '-';
}

export function formatDateTimeForInput (date: Date): string {
    const parsedDate = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = parsedDate.getFullYear();
    const month = pad(parsedDate.getMonth() + 1);
    const day = pad(parsedDate.getDate());
    const hours = pad(parsedDate.getHours());
    const minutes = pad(parsedDate.getMinutes());
    const seconds = pad(parsedDate.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export function formatDateForInput (date: Date): string {
    return new Date(date).toISOString().substring(0, 10);
};

export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}