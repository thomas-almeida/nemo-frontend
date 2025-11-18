import { create } from "zustand";
import { persist } from 'zustand/middleware';

type ProjectState = {
    projects: any[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    isLoading: false,
    error: null,
}

const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            ...initialState,
            setProjects: (projects: any[]) => set({ projects }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'project-storage',
            partialize: (state) => ({
                projects: state.projects,
            })
        }
    )
)

export default useProjectStore

