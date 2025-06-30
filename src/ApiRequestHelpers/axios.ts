import axios from "axios"
import { refreshAccessToken } from "./authApiRequest";

const api = axios.create({
    baseURL: import.meta.env.VITE_HTTP_API,
    withCredentials: true
})

let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config;

        if(err.response.status === 403 || err.response.status === 401 && !original._retry) {
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve,
                        reject
                    });
                }).then(() => api(original));
            }
            original._retry = true;
            isRefreshing = true;

            try {
                await refreshAccessToken();
                queue.forEach(p => p.resolve());
                queue = [];
                return api(original);
            } catch(error) {
                queue.forEach(p => p.reject(error));
                queue = [];
                throw error;
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(err);
    }
);

export default api;