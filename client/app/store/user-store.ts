import { create } from "zustand";
import { persist } from 'zustand/middleware';

type UserState = {
    id: string;
    username: string;
    email: string;
    sessionId: string;
    isLoading: boolean;
    error: string | null;
}

type UserStore = UserState & {
    setUser: (user: Partial<UserState>) => void;
    clearUser: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

const initialState: UserState = {
    id: "",
    username: "",
    email: "",
    sessionId: "",
    isLoading: false,
    error: null,
}

const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,
            setUser: (user: Partial<UserState>) => set((state) => ({ ...state, ...user })),
            clearUser: () => set(initialState),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                id: state.id,
                username: state.username,
                email: state.email,
                sessionId: state.sessionId,
            })
        }
    )
)

export default useUserStore;