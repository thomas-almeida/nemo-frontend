import axios from "axios";

export const createUser = async (user: any) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/user`, user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};