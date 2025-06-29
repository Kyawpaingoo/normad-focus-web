import api from "./axios";
import type { AxiosResponse} from "axios";
import type { errorResponseDto, successResponseDto, sortDirection, PaginationResponse } from "../dtos/responseDtos";
import type { ExpenseDto, upsertExpenseRequestDto } from "../dtos/expenseDtos";

export const createExpense = async (data: upsertExpenseRequestDto): Promise<ExpenseDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<ExpenseDto>, errorResponseDto> = await api.post('/expense/insert', request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getExpense = async (id: number, userId: number): Promise<ExpenseDto> => {
    const response: AxiosResponse<successResponseDto<ExpenseDto>, errorResponseDto> = await api.get(`/expense/get-by-id/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const getExpenseByPaging = async (page: number, pageSize: number, userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string | undefined, category?: string | undefined, type?: string | undefined): Promise<PaginationResponse<ExpenseDto>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        userId: userId.toString(),
        year: year.toString(),
        month: month.toString(),
        sortDir,
    });

    if(q) params.append('q', q);
    if(category) params.append('category', category);
    if(type) params.append('type', type);

    const response: AxiosResponse<successResponseDto<PaginationResponse<ExpenseDto>>, errorResponseDto> = await api.get(`/expense/get-by-paging?${params.toString()}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const updateExpense = async (data: upsertExpenseRequestDto, id: number, userId: number): Promise<ExpenseDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<ExpenseDto>, errorResponseDto> = await api.put(`/expense/update/${id}/${userId}`, request, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const softDeleteExpense = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.patch(`/expense/soft-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const hardDeleteExpense = async (id: number, userId: number): Promise<string> => {
    const response: AxiosResponse<successResponseDto<string>, errorResponseDto> = await api.delete(`/expense/hard-delete/${id}/${userId}`);

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}
