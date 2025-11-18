import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export const getProjectsByOwnerId = async (ownerId: string) => {
    const response = await axios.get(`${BASE_URL}/project/${ownerId}`);
    return response.data;
}
