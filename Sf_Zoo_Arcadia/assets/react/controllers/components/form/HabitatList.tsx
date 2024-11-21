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
      <div className="container-fluid habitats-container d-flex flex-column justify-content-center align-items-center p-0 m-0">
        <div className="habitat-content d-flex flex-row flex-wrap align-items-center justify-content-center p-0 m-0 w-100">
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
                      src={`${process.env.REACT_APP_API_BASE_URL}${habitat.image.imagePath}`}
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

