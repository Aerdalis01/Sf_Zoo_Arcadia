import React, { useEffect, useState } from 'react';
import { Animal } from '../../../models/animalInterface';



interface AnimalDetailProps {
  animalId: number;
  onBack: () => void;
}

export const AnimalDetail: React.FC<AnimalDetailProps> = ({ animalId, onBack }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(`/api/animal/${animalId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'animal.');

        const data = await response.json();



        setAnimals(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [animalId]);

  if (loading) return <p>Chargement...</p>;

  if (!animals) return <p>Animal non trouvé</p>;

  
  return (
    <div className='animal-details-container'>
      {animals.map((animal, index) => {
      const alimentationParDate = animal.alimentation?.reduce((acc, aliment) => {
        const date = new Date(aliment.date).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(aliment);
        return acc;
      }, {} as Record<string, typeof animal.alimentation>);
        return (
          <div key={index} className="animal-detail d-flex flex-column align-items-center">
            <button onClick={onBack}>Retour à l'habitat</button>
            <div className="animal-text text-center align-items-center rounded-5 p-3">
              <h2>{animal.nom}</h2>
              {animal.image && animal.image.imagePath ? (
                <img
                  className="img-fluid rounded-circle mt-3 detail-animal--img"
                  src={`${process.env.REACT_APP_API_BASE_URL}${animal.image.imagePath}`}
                  alt={animal.nom}
                />
              ) : (
                <p><em>Pas d'image disponible</em></p>
              )}
              <p><strong>Race:</strong> {animal.race ? animal.race.nom : "Race inconnue"}</p>

              {animal.alimentation && animal.alimentation.length > 0 ? (
                <div>
                   {Object.entries(alimentationParDate).map(([date, alimentations], dateIndex) => (
                    <div key={dateIndex} className="alimentation-date-group mt-3">
                      <h4>{date}</h4>
                      {alimentations.map((aliment, alimentIndex) => (
                        <div key={alimentIndex} className="aliment-info mt-2">
                          <p><strong>Heure:</strong> {new Date(aliment.heure).toLocaleTimeString()}</p>
                          <p><strong>Nourriture:</strong> {aliment.nourriture}</p>
                          <p><strong>Quantité:</strong> {aliment.quantite}</p>

                          {aliment.animalReport ? (
                            <div>
                              <p><strong>État de santé:</strong> {aliment.animalReport.etat}</p>
                              <p><strong>Détails de l'état:</strong> {aliment.animalReport.etatDetail}</p>
                            </div>
                          ) : (
                            <p><em>Aucun rapport de santé disponible</em></p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p><em>Aucune information d'alimentation disponible</em></p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};