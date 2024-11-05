
export interface Habitat {
  id: number;
  nom: string;
  description: string;
  image?: {
    id: number;
    nom: string;
    imagePath: string;
  };
  animals?: {
    id: number;
    nom: string;
    etat?: string;
    image?: {
      id: number;
      nom: string;
      imagePath: string;
    };
  }[];
}