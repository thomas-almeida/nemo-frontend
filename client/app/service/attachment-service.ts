import axios from "axios";

interface AttachmentData {
    file: File;
    name: string;
    projectId: string;
    ownerId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL
const REFRESH_TOKEN = process.env.NEXT_PUBLIC_GOOGLE_REFRESH_TOKEN!

export const createAttachment = async (attachment: AttachmentData) => {
    const { file, name, projectId, ownerId } = attachment;

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('projectId', projectId);
        formData.append('ownerId', ownerId);
        formData.append('refreshToken', REFRESH_TOKEN);

        const response = await axios.post(`${BASE_URL}/attachment`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating attachment:', error);
        throw error;
    }
};


export const getAttachments = async (ownerId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/attachment/${ownerId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting attachments:', error);
        throw error;
    }
}