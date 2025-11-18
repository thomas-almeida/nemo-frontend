export interface Unit {
  _id: string;
  footage: number;
  price: number;
  type?: string;
  status?: string;
}

export interface ProjectInfo {
  name: string;
  address: string;
  developer: string;
  releaseDate?: string;
  description?: string;
}

export interface Project {
  _id: string;
  info: ProjectInfo;
  type?: string[];
  units: Unit[];
  status?: string;
  amenities?: string[];
  [key: string]: any; // Para outras propriedades que possam existir
}
