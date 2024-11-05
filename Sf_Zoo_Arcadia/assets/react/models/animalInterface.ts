
export interface Animal {
  id: number;
  nom: string;
  idHabitat?: string;
  idRace?: string;
  nomRace?: string;
  etat?: string;
  animalReport?: string;
  image?:{
    id: number;
    nom: string;
    imagePath: string;
  };
}