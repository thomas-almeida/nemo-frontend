'use client'

import { useEffect } from "react";
import useAttachmentStore from "../store/attachment-store";
import { getAttachments } from "../service/attachment-service";
import { useAuth } from "./use-auth";

export function useAttachments() {
    const { attachments, isLoading, error } = useAttachmentStore()
    const { user } = useAuth()

    useEffect(() => {
        const fetchAttachments = async () => {
            if (user.id) {
                try {
                    const attachmentsData = await getAttachments(user.id)
                    useAttachmentStore.setState({ attachments: attachmentsData })
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchAttachments()
    }, [user.id])

    return { attachments, isLoading, error }
}
