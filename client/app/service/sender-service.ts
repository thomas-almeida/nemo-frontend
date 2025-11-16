import axios from "axios";

export const sendMessage = async (number: string, message: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/send-message`, {
            number,
            message,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}