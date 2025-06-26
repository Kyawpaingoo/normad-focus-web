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