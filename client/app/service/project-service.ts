import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export const getProjectsByOwnerId = async (ownerId: string) => {
    const response = await axios.get(`${BASE_URL}/project/${ownerId}`);
    return response.data;
}

export interface CreateProjectData {
    name: string;
    owner: string;
    [key: string]: any;
}

export const createProject = async (project: CreateProjectData, bookFile?: File) => {
    const formData = new FormData();
    
    // Adiciona os campos do projeto ao FormData
    Object.keys(project).forEach(key => {
        formData.append(key, project[key]);
    });
    
    // Adiciona o arquivo do livro se existir
    if (bookFile) {
        formData.append('book', bookFile);
    }
    
    const response = await axios.post(`${BASE_URL}/project`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
}
