export interface Alimentation {
  id: number;
  nourriture: string;
  quantite: string;
  idAnimal: string;
  createdBy?: string;  
  animal?: {
    id: number;
    nom: string;
  };
  date?: string;
  heure?: string;
  formattedDate?: string;
  formattedHeure?: string; 
  isUsed?: boolean;
}
