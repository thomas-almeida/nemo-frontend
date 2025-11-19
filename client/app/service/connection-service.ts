import axios from "axios";

export const getQrCode = async (sessionId: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/${sessionId}/qrcode`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
