import { create } from "zustand";
import { persist } from 'zustand/middleware';

type UserState = {
    id: string;
    username: string;
    email: string;
    sessionId: string;
}

type UserStore = UserState & {
    setUser: (user: UserState) => void;
    clearUser: () => void;
}

const initialState: UserState = {
    id: "",
    username: "",
    email: "",
    sessionId: "",
}

const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,
            setUser: (user: UserState) => set(user),
            clearUser: () => set(initialState),
        }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
        }
    )
)

export default useUserStore;