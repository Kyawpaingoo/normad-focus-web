import { useQuery } from "@tanstack/react-query"
import { verfiyUser } from "../ApiRequestHelpers/authApiRequest"

export const useVerifyUser = () => {
    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => verfiyUser(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
    })
}