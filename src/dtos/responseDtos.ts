export type successResponseDto<T> = {
    success: boolean;
    data: T;
    msg: string;
}

export type errorResponseDto = {
    success: boolean;
    error: string;
    status: number;
}

export const dataResponseDto = {
    Success: "Success",
    Error: "Error"
}

export type PaginationResponse<T> ={
    totalCount: number;
    totalPage: number;
    results: T[] | [];
    page: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    additionalData?: string;
}

export type sortDirection = "asc" | "desc";