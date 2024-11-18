import React, { useEffect, useState } from 'react';
import { Habitat } from '../../../models/habitatInterface';
import { HabitatDetail } from './HabitatDetail';

export const HabitatList = () => {
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHabitatId, setSelectedHabitatId] = useState<number | null>(null);


  useEffect(() => {
    const fetchHabitat = async () => {
      try {
        const response = await fetch('/api/habitat', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis.');
        }

        const data = await response.json();
        console.log("Données récupérées :", data);
        setHabitats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitat();
  }, []);

  const handleHabitatClick = (id: number) => {
    console.log("Habitat cliqué avec ID :", id);
    setSelectedHabitatId(id);
  };

  const handleBack = () => {
    setSelectedHabitatId(null);
  };
  if (selectedHabitatId) {
    return <HabitatDetail habitatId={selectedHabitatId} onBack={handleBack} />;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <section id="habitats">
      <div className="habitats-accueil">
        <img className="img-fluid w-100 d-block" src="/uploads/images/svgDeco/habitat-acc.svg" alt="un renne blanc les pattes dans un lac" />
      </div>
      <div className="container-fluid habitats-container d-flex flex-column justify-content-center p-0 m-0">
        <div className="habitat-content d-flex flex-row flex-wrap p-0 m-0 w-100">
          <ul className="row w-100 list-unstyled">
            {habitats.map((habitat) => (
              <li
                key={habitat.id}
                className="col-12 col-lg-4 d-flex flex-column align-items-center mb-4"
                onClick={() => handleHabitatClick(habitat.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{habitat.nom}</h3>
                {habitat.image && (
                  <div className='circular-container'>
                    <img
                      src={`http://127.0.0.1:8000${habitat.image.imagePath}`}
                      alt={`Image de ${habitat.nom}`}
                      className="img-fluid img-circular"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <img className="vague-bottom--lg w-100" src="/uploads/images/svgDeco/vagOrBotLg.svg" alt="forme de vague verte" />
      </div>
    </section>
  );
};

