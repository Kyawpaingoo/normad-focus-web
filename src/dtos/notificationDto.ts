export type NotificationDto = {
    id: number;
    user_id: number;
    source_type: string;
    source_id: number;
    title: string;
    message: string;
    notify_at: Date;
    sent_at: Date;
    created_at: Date;
    sent: boolean;
}