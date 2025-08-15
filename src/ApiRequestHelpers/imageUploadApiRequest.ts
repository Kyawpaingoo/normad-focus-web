import api from "./axios";

export const imageUpload = async (data: string) => {

    const res = await api.post(`/image/upload`, {base64: data});

    const image = res.data.url;
    return image;
} 