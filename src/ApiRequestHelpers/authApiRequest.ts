import axios, { type AxiosResponse } from "axios"
import type { LoginRequestDto, LoginResponseDto, RegisterResponseDto, RegisterRequestDto, User } from "../dtos/authDtos";
import type { errorResponseDto, successResponseDto } from "../dtos/responseDtos";

// export const refreshAccessToken = async () : Promise<{accessToken: string, refreshToken: string} | null> => {
//     const response: AxiosResponse<successResponseDto<User>, errorResponseDto> = await axios.get('/auth/refresh-token',{
//         withCredentials: true
//     });
//     if(response.status !== 200) return null;
    
//     return response.data.data;
// }

export const login = async (data: LoginRequestDto): Promise<LoginResponseDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<LoginResponseDto>, errorResponseDto> = await axios.post('/auth/login', request, { 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });
    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const register = async (data: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const request = JSON.stringify(data);
    const response: AxiosResponse<successResponseDto<RegisterResponseDto>, errorResponseDto> = await axios.post('/auth/register', request, { 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });

    if(response.status == 200) return response.data.data;

    throw new Error(response.data.msg);
}

export const verfiyUser = async(): Promise<User | null> => {
    // const token: string | null = getToken();
    // const headers = token
    //     ? { Authorization: `Bearer ${token}` }
    //     : {}; 
    // console.log(headers)
    const response: AxiosResponse<successResponseDto<User>, errorResponseDto> = await axios.get('/auth/verify-user', {
       // headers: headers,
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 403
    });
    console.log(response);
    if(response.status == 200) return response.data.data;
    if (response.status === 403) {
            return null; 
    }
    throw new Error(response.data.msg);
}

// const getToken = (): string | null => {
//     const token: string | null = localStorage.getItem('accessToken');

//     return token;
// }