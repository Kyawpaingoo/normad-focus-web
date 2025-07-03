export type upsertTaskDto = {
    userId: number,
    title: string,
    description: string,
    status: 'To Do' | 'In Progress' | 'Done',
    priority: 'High' | 'Medium' | 'Low',
    start_date: Date,
    due_date: Date,
    notify_at: Date
}

export type TaskDto = {
    id: number;
    created_at: Date | null;
    user_id: number;
    title: string | null;
    is_deleted: boolean | null;
    notify_at: Date | null;
    description: string | null;
    status: string | null;
    priority: string | null;
    start_date: Date | null;
    due_date: Date | null;
}