import api from './axios';
import { type AxiosResponse } from 'axios';
import type { errorResponseDto, successResponseDto, sortDirection, ViewMode, FlexibleResponse } from '../dtos/responseDtos';
import type { upsertTaskDto, TaskDto } from '../dtos/taskDto';

export const createTask = async (data: upsertTaskDto): Promise<TaskDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<TaskDto>, errorResponseDto> = await api.post('/task/insert', request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getTask = async (id: number, userId: number): Promise<TaskDto> => {
    const response: AxiosResponse<successResponseDto<TaskDto>, errorResponseDto> = await api.get(`/task/get-by-id/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getTaskByView = async(viewMode: ViewMode = 'board', cursor: string | null, limit: number, userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string, status?: string, priority?:string): Promise<FlexibleResponse<TaskDto>> => {
    const params = new URLSearchParams({
        viewMode: viewMode,
        cursor: cursor || '',
        limit: limit.toString(),
        userId: userId.toString(),
        year: year.toString(),
        month: month.toString(),
        sortDir,
    });

    if(q) params.append('q', q);
    if(status) params.append('status', status);
    if(priority) params.append('priority', priority);

    const response: AxiosResponse<successResponseDto<FlexibleResponse<TaskDto>>, errorResponseDto> = await api.get(`/task/get-by-view?${params.toString()}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const updateTask = async(data: upsertTaskDto, id: number, userId: number): Promise<TaskDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<TaskDto>, errorResponseDto> = await api.put(`/task/update/${id}/${userId}`, request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const softDeleteTask = async (id: number , userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.patch(`/task/soft-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const hardDeleteTask = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.delete(`/task/hard-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}