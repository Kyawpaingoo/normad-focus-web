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

export type ViewMode = 'list' | 'board';

export type InfiniteScrollResponse<T> = {
    results: T[] | [],
    nextCursor: string | null,
    hasNextPage: boolean,
    totalCount?: number,
    additionalData?: string
}

export type KanbanResponse<T> = {
    columns: Record<string, {
        title: string;
        items: T[];
        totalCount: number;
    }>,
    totalCount: number;
    addtionalData?: string;
}

export type FlexibleResponse<T> = PaginationResponse<T> | InfiniteScrollResponse<T> | KanbanResponse<T>;

export type KanbanCard = {
    id: number;
    title: string;
    description: string;
}