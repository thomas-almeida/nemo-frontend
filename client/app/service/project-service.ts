import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export const getProjectsByOwnerId = async (ownerId: string) => {
    const response = await axios.get(`${BASE_URL}/project/${ownerId}`);
    return response.data;
}

export const createProject = async (project: any) => {
    const response = await axios.post(`${BASE_URL}/project`, project);
    return response.data;
}
