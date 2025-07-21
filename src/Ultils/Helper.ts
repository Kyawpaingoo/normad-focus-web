import { type FlexibleResponse, type InfiniteScrollResponse, type KanbanResponse } from '../dtos/responseDtos';
import type { TaskDto } from '../dtos/taskDto';
export function getMonthYearString(date: Date) {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
}

export function getPriorityColor (priority: string | null) {
    switch (priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'success';
    }
}

export const updateInfiniteScrollData = (
    oldData: InfiniteScrollResponse<TaskDto>,
    updater: (results: TaskDto[]) => TaskDto[]
): InfiniteScrollResponse<TaskDto> => ({
    ...oldData,
    results: updater(oldData.results)
});

export const updateKanbanData = (
    oldData: KanbanResponse<TaskDto>,
    updater: (task: TaskDto) => TaskDto,
    taskId?: number,
    newTask?: TaskDto
): KanbanResponse<TaskDto> => {
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


export const isInfiniteScrollResponse = <T>(data: FlexibleResponse<T>): data is InfiniteScrollResponse<T> => {
    return 'results' in data && 'nextCursor' in data && 'hasNextPage' in data;
}

export const isKanbanResponse = <T>(data: FlexibleResponse<T>): data is KanbanResponse<T> => {
    return 'columns' in data && 'totalCount' in data;
}