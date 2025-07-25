import type { AxiosResponse } from "axios";
import type { NotificationDto } from "../dtos/notificationDto";
import type { errorResponseDto } from "../dtos/responseDtos";
import axios from "axios";

const go_api_url = import.meta.env.VITE_GO_API;

export const getNotificationList = async (userId: number): Promise<NotificationDto[]> => {
    const response: AxiosResponse<NotificationDto[], errorResponseDto> = await axios.get(`${go_api_url}/${userId}`);

    if(response.status == 200) return response.data;

    throw new Error("no task found.")
}