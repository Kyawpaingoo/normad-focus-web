import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { genereateICSContent } from "../ApiRequestHelpers/meetingScheduleApiRequest"

export const useICSContent = (id: number, userId: number, enable: boolean = true) => {
    return useQuery<string, AxiosError>({
        queryKey: ['ics', 'content', id, userId],
        queryFn: () => genereateICSContent(id, userId),
        enabled: enable,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    })
}