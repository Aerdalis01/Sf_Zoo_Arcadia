import { Animal } from "./animalInterface";
export interface Habitat {
  id: number;
  nom: string;
  description: string;
  image?: {
    id: number;
    nom: string;
    imagePath: string;
  };
  animals?: Animal[] ;
    
}