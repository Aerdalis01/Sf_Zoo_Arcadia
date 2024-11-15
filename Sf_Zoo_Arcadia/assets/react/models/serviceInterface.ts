import { SousService } from "./sousServiceInterface";

export interface Service {
  id: number;
  nom: string;
  titre: string;
  description: string;
  horaireTexte: string; 
  carteZoo: boolean;
  image?:{
    id: number;
    nom: string;
    imagePath: string;
  }
  sousServices?: SousService[];
}