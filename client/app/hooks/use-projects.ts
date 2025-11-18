'use client'

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import useProjectStore from "@/app/store/project-store";
import { getProjectsByOwnerId } from "../service/project-service";

export function useProjects() {
    const { user } = useAuth();
    const { projects, isLoading, error } = useProjectStore();

    useEffect(() => {
        const fetchProjects = async () => {
            if (user.id) {

                console.log(user.id)

                try {
                    const projectsData = await getProjectsByOwnerId(user.id);
                    useProjectStore.setState({ projects: projectsData.data });

                    console.log(projectsData.data)
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchProjects();
    }, [user.id]);

    return { projects, isLoading, error };
}
