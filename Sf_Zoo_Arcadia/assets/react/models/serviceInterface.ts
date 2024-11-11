import { SousService } from "./sousServiceInterface";

export interface Service {
  id: number;
  nom: string;
  titre: string;
  description: string;
  horaire: {
    horaire1?: { nom: string; heure: string }[];
    horaire2?: { nom: string; heure: string }[];
  } | string; 
  carteZoo: boolean;
  image?:{
    id: number;
    nom: string;
    imagePath: string;
  }
  sousServices?: SousService[];
}