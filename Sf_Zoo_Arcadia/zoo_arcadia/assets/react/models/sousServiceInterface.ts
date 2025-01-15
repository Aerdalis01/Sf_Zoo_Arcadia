
export interface SousService {
  id: number;
  nom: string;
  description: string;
  menu: boolean;
  idService?: string;
  image?:{
    id: number;
    nom: string;
    imagePath: string;
  }
}