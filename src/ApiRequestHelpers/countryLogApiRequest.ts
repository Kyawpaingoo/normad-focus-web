import type { AxiosResponse } from "axios";
import type { countryLog, upsertCountryLog } from "../dtos/countryLogDtos";
import type { errorResponseDto, PaginationResponse, sortDirection, successResponseDto } from "../dtos/responseDtos";
import api from "./axios";

export const createCountryLog = async (data: upsertCountryLog): Promise<countryLog> => {
    const request = JSON.stringify(data);
    console.log(request);
    const response: AxiosResponse<successResponseDto<countryLog>, errorResponseDto> = await api.post('/country-log/insert', request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getCountryLog = async (id: number, userId: number): Promise<countryLog> => {
    const response: AxiosResponse<successResponseDto<countryLog>, errorResponseDto> = await api.get(`/country-log/get-by-id/${id}/${userId}`);

    if (response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getCountryLogByPaging = async(page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string | undefined): Promise<PaginationResponse<countryLog>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        userId: userId.toString(),
        sortDir,
    });

    if(q) params.append('q', q);
    const response: AxiosResponse<successResponseDto<PaginationResponse<countryLog>>, errorResponseDto> = await api.get(`/country-log/get-by-paging?${params.toString()}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const updateCountryLog = async (data: upsertCountryLog, id: number, userId: number): Promise<countryLog> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<countryLog>, errorResponseDto> = await api.put(`/country-log/update/${id}/${userId}`, request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const hardDeleteCountryLog = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.delete(`/country-log/delete/${id}/${userId}`);

    if (response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}