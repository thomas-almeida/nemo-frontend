'use client'

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import useCustomerListStore from "@/app/store/customerlist-store"
import { getCustomerListsByOwnerId } from "../service/customerlist-service"

export function useCustomerList() {
    const { user } = useAuth();
    const { customerLists, isLoading, error } = useCustomerListStore();

    useEffect(() => {
        const fetchCustomerLists = async () => {
            if (user.id) {
                try {
                    const customerListsData = await getCustomerListsByOwnerId(user.id);
                    useCustomerListStore.setState({ customerLists: customerListsData.data });
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchCustomerLists();
    }, [user.id]);

    return { customerLists, isLoading, error };
}
