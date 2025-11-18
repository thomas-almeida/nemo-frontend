'use client'

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import useMessageStore from "@/app/store/message-store";
import { getMessagesByOwnerId } from "../service/message-service";

export function useMessages() {
    const { user } = useAuth();
    const { messages, isLoading, error } = useMessageStore();

    useEffect(() => {
        const fetchMessages = async () => {
            if (user.id) {
                try {
                    const messagesData = await getMessagesByOwnerId(user.id);
                    console.log(messagesData)
                    useMessageStore.setState({ messages: messagesData});
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchMessages();
    }, [user.id]);

    return { messages, isLoading, error };
}