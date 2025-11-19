import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL

interface createCustomerPayload {
    name: string;
    phone: string;
    userId: string;
}

export const createCustomer = async (payload: createCustomerPayload) => {
    const response = await axios.post(`${API_URL}/customer`, payload);
    return response.data;
};

export const getCustomerById = async (customerId: string, userId: string) => {
    const response = await axios.get(`${API_URL}/${customerId}/${userId}`);
    return response.data
}

export const getAllCustomers = async (userId: string) => {
    const response = await axios.get(`${API_URL}/customer/${userId}`)
    return response.data
}