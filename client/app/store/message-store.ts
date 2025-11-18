import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type MessageState = {
    messages: any[],
    isLoading: boolean,
    error: string | null,
}

const initialState: MessageState = {
    messages: [],
    isLoading: false,
    error: null,
}

const useMessageStore = create<MessageState>()(
    persist(
        (set) => ({
            ...initialState,
            setMessages: (messages: any[]) => set({ messages }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'message-storage',
            partialize: (state) => ({
                messages: state.messages,
            })
        }
    )
)

export default useMessageStore
