import React, { useEffect, useState } from 'react';
import { Animal } from '../../../models/animalInterface';



interface AnimalDetailProps {
  animalId: number;
  onBack: () => void;
}

export const AnimalDetail: React.FC<AnimalDetailProps> = ({ animalId, onBack }) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(`/api/animal/${animalId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'animal.');

        const data = await response.json();
        console.log("Données de l'animal:", data);
        setAnimal(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [animalId]);

  if (loading) return <p>Chargement...</p>;

  if (!animal) return <p>Animal non trouvé</p>;

  return (

    <div className='animal-detail d-flex flex-column align-items-center'>
    <div className='animal-text text-center align-items-center rounded-5 p-3'>
      <h2>{animal.nom}</h2>
      <p><strong>Race:</strong> {animal.nomRace}</p>
      <p><strong>État de santé:</strong> {animal.animalReport || "Aucun rapport disponible"}</p>
    </div>
    {animal.image && (
      <img 
        className='animal-img img-fluid rounded-circle mt-3' 
        src={`http://127.0.0.1:8000${animal.image.imagePath}`} 
        alt={animal.nom} 
      />
    )}
    <button className="btn btn-primary mt-4" onClick={onBack}>Retour à la liste</button>
  </div>
);
};