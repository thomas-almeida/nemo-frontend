import axios from "axios";

export const sendMessage = async (number: string, message: string) => {
    try {
        const response = await axios.post('http://localhost:3000/send-message', {
            number,
            message,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}