import React, { useEffect, useState } from 'react';

export const ZooHoraires = () => {
  const [horaires, setHoraires] = useState([]);

  useEffect(() => {
    fetch('/api/horaire') // Votre endpoint pour récupérer les horaires
      .then((response) => response.json())
      .then((data) => {
        setHoraires(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des horaires:', error);
      });
  }, []);

  return (
    <div>
    <h2>Horaires du zoo</h2>
    {horaires.map((horaire) => (
      <div key={horaire.id}>
        <ul>
          {horaire.horaireTexte
            .split(/\r?\n/)
            .map((ligne, index) => (
              <li key={index}>{ligne}</li>
            ))}
        </ul>
      </div>
    ))}
  </div>
  );
};
