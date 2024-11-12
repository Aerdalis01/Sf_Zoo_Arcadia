// HabitatDetail.tsx
import React, { useEffect, useState } from 'react';
import { Habitat } from '../../../models/habitatInterface';
import { AnimalDetail } from './AnimalDetail';
import { Animal } from '../../../models/animalInterface';

interface HabitatDetailProps {
  habitatId: number;
  onBack: () => void;
}

export const HabitatDetail: React.FC<HabitatDetailProps> = ({ habitatId, onBack }) => {
  const [habitat, setHabitat] = useState<Habitat | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedAnimalName, setSelectedAnimalName] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitat = async () => {
      try {
        const response = await fetch(`/api/habitat/${habitatId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'habitat.");

        const data = await response.json();
        setHabitat(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitat();
  }, [habitatId]);



  const handleAnimalClick = async (id: number, nom: string) => {
    console.log("Animal cliqué avec ID :", id, "et nom", nom);
    setSelectedAnimalId(id);
    setSelectedAnimalName(nom);
    try {
      const response = await fetch(`/api/animalVisite/${id}/${nom}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data.message); 
    } catch (error) {
      console.error("Erreur lors de l'incrémentation de la visite", error);
    }
  };


  const handleBack = () => {
    setSelectedAnimalId(null);
  };
  if (selectedAnimalId) {
    return <AnimalDetail animalId={selectedAnimalId} onBack={handleBack} />;
  }
  if (loading) return <p>Chargement...</p>;

  if (!habitat) return <p>Habitat non trouvé</p>;

  return (
    <div className="habitat-detail d-flex flex-column align-items-center">
      <div className="habitat-text text-center align-items-center rounded-5">
        <h2>{habitat.nom}</h2>
        <p>{habitat.description}</p>
      </div>
      {habitat.image && (
        <img
          className="habitat-img"
          src={`http://127.0.0.1:8000${habitat.image.imagePath}`}
          alt={habitat.nom}
        />
      )}
      <button onClick={onBack}>Retour aux habitats</button>
      <h3>Animaux dans cet habitat :</h3>
      <ul className="row w-100 list-unstyled m-0 p-0">
        {habitat.animals?.map((animal, index) => {
          const latestReport = animal.animalReport?.[animal.animalReport.length - 1];
          return (
            <li
              className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center text-center mb-4"
              key={animal.id ?? index}
              onClick={() => handleAnimalClick(animal.id, animal.nom)}
              style={{ cursor: 'pointer' }}
            >
              <p className="fs-4">
                {animal.nom}
                {latestReport?.etat && (
                  <span className="text-muted"> - {latestReport.etat}</span>
                )}
              </p>
              {animal.image && (
                <img
                  src={`http://127.0.0.1:8000${animal.image.imagePath}`}
                  alt={animal.nom}
                  className="img-fluid animal-img"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};