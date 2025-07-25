export type upsertTaskDto = {
    id: number,
    userId: number,
    title: string | null,
    description: string | null,
    status: TaskStatus,
    priority: TaskPriority,
    start_date: Date | null,
    due_date: Date | null,
    notify_at: Date | null
}

export type TaskDto = {
    id: number;
    created_at: Date | null;
    user_id: number;
    title: string | null;
    is_deleted: boolean | null;
    notify_at: Date | null;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    start_date: Date | null;
    due_date: Date | null;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type TaskPriority = 'High' | 'Medium' | 'Low';