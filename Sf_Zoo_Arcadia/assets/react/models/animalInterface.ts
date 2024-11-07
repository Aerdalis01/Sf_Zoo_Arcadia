
export interface Animal {
  id: number;
  nom: string;
  idHabitat?: string;
  race?: {
    id: number;
    nom: string;
  }
  idRace?: string;
  nomRace?: string;
  alimentation?: Array<{
    id: number;
    date: string;
    heure: string;
    nourriture: string;
    quantite: string;
    animalReport?: {
      etat: string;
      etatDetail: string;
    };
  }>;
  animalReport?: Array<{
    etat: string;
    etatDetail: string;
    createdAt: string;
  }>;
  image?:{
    id: number;
    nom: string;
    imagePath: string;
  };
  habitat?: {
    id: number;
    nom: string;
    description: string;
    image?: {
      id: number;
      nom: string;
      imagePath: string;
    };
  };
}