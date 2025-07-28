import type { AxiosResponse } from "axios";
import type { MeetingScheduleDto, upsertMeetingSchdeuleDto } from "../dtos/meetingScheduleDtos";
import type { errorResponseDto, PaginationResponse, sortDirection, successResponseDto } from "../dtos/responseDtos";
import api from "./axios";

export const createMeetingSchedule = async(data: upsertMeetingSchdeuleDto): Promise<MeetingScheduleDto> => {
    
    const request: string = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<MeetingScheduleDto>, errorResponseDto> = await api.post('/meeting-schedule/insert', request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    

    if(response.status === 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getMeetingScheduleByPaging = async (page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string | undefined): Promise<PaginationResponse<MeetingScheduleDto>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        userId: userId.toString(),
        sortDir,
    });

    if(q) params.append('q', q);

    const response: AxiosResponse<successResponseDto<PaginationResponse<MeetingScheduleDto>>, errorResponseDto> = await api.get(`/meeting-schedule/get-by-paging?${params.toString()}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getMeetingSchedule = async (id: number, userId: number): Promise<MeetingScheduleDto> => {
    const response: AxiosResponse<successResponseDto<MeetingScheduleDto>, errorResponseDto> = await api.get(`/meeting-schedule/get-by-id/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const updateMeetingSchedule = async (data: upsertMeetingSchdeuleDto, id: number, userId: number): Promise<MeetingScheduleDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<MeetingScheduleDto>, errorResponseDto> = await api.put(`/meeting-schedule/update/${id}/${userId}`, request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const softDeleteMeetingSchedule = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.patch(`/meeting-schedule/soft-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const hardDeleteMeetingSchedule = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.delete(`/meeting-schedule/hard-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const genereateICSContent = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<string, errorResponseDto> = await api.get(`/meeting-schedule/generate-ics-content/${id}/${userId}`, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': `attachment; filename=meeting-${id}.ics`
        }
    });

    if(response.status == 200) return response.data;

    throw new Error('Failed to generate ICS Content file.');
}