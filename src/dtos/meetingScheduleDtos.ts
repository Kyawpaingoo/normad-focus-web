export type upsertMeetingSchdeuleDto = {
    id: number,
    user_id: number,
    title: string,
    description: string, 
    start_time: Date,
    end_time: Date
}

export type MeetingScheduleDto = {
    id: number,
    user_id: number,
    title: string,
    description: string, 
    start_time: Date,
    end_time: Date,
    create_at: Date,
    is_deleted: Date
}