import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type AttachmentState = {
    attachments: any[],
    isLoading: boolean,
    error: string | null,
}

const initialState: AttachmentState = {
    attachments: [],
    isLoading: false,
    error: null,
}

const useAttachmentStore = create<AttachmentState>()(
    persist(
        (set) => ({
            ...initialState,
            setAttachments: (attachments: any[]) => set({ attachments }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'attachment-storage',
            partialize: (state) => ({
                attachments: state.attachments,
            })
        }
    )
)

export default useAttachmentStore
