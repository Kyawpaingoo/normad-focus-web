import api from "./axios";
import { type AxiosResponse } from "axios"
import type { LoginRequestDto, RegisterResponseDto, RegisterRequestDto, User } from "../dtos/authDtos";
import type { errorResponseDto, successResponseDto } from "../dtos/responseDtos";

export const refreshAccessToken = async () : Promise<User | null> => {
    const response: AxiosResponse<successResponseDto<User>, errorResponseDto> = await api.get('/auth/refresh-token',{
        withCredentials: true
    });
    if(response.status == 200) return response.data.data;
    
    throw new Error(response.data.msg);
}

export const login = async (data: LoginRequestDto): Promise<User> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<User>, errorResponseDto> = await api.post('/auth/login', request, { 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });
    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const register = async (data: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<RegisterResponseDto>, errorResponseDto> = await api.post('/auth/register', request, { 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const verfiyUser = async(): Promise<User | null> => {
    const response: AxiosResponse<successResponseDto<User>, errorResponseDto> = await api.get('/auth/verify-user', {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 403
    });
    if(response.status == 200) return response.data.data;
    if (response.status === 403) {
            return null; 
    }
    throw new Error(response.data.msg);
}

