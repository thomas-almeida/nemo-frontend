import axios from "axios";

export const sendMessage = async (sessionId: string, number: string, messages: any[]) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/${sessionId}/send-message`, {
            number,
            messages,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}