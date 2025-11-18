import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

interface createMessagePayload {
    name: string;
    copy: string;
    ownerId: string;
    projectId: string;
}

export const createMessage = async (payload: createMessagePayload) => {
    const response = await axios.post(`${API_URL}/message`, payload);
    return response.data;
};

export const getMessagesByOwnerId = async (ownerId: string) => {
    const response = await axios.get(`${API_URL}/message/${ownerId}`);
    return response.data;
};
