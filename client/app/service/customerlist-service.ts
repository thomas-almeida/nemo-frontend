import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL

interface createCustomerListPayload {
    name: string;
    owner: string;
    customers: string[];
}


export const createCustomerList = async (payload: createCustomerListPayload) => {
    try {
        const response = await axios.post(`${API_URL}/customer-list`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating customer list:', error);
        throw error;
    }
}

export const getCustomerListsByOwnerId = async (ownerId: string) => {
    const response = await axios.get(`${API_URL}/customer-list/owner/${ownerId}`);
    return response.data;

}

export const addCustomerToList = async (ownerId: string, customerId: string) => {
    try {
        const response = await axios.post(`${API_URL}/customer-list/${ownerId}/customer`, { customerId });
        return response.data;
    } catch (error) {
        console.error('Error adding customer to list:', error);
        throw error;
    }
}