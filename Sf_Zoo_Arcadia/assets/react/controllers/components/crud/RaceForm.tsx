import React, { useState, useEffect } from 'react';
import { TextInputField } from '../form/TextInputField';

export const RaceForm = ({ onSubmit, initialRace }) => {
  const [nom, setNom] = useState(initialRace?.nom || '');

  useEffect(() => {
    if (initialRace) {
      setNom(initialRace.nom);
    }
  }, [initialRace]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom });
    if (!initialRace) {
      setNom('');  
    }
  };

  return (
    <div>
      <TextInputField
        name="nom"
        label="Nom de la race"
        value={nom}  // Utilise la variable d'état `nom`
        onChange={(e) => setNom(e.target.value)}  // Mettre à jour `nom`
      />
      <button type="button" onClick={handleSubmit}>
        {initialRace ? 'Modifier' : 'Créer'} la race
      </button>
    </div>
  );
};