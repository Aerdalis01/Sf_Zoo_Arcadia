import React, { useState, useEffect } from 'react';
import { TextInputField } from './form/TextInputField';

export const RaceForm = ({ onSubmit, initialRace }) => {
  const [nom, setNom] = useState(initialRace ? initialRace.nom : '');

  useEffect(() => {
    if (initialRace) {
      setNom(initialRace.nom);
    }
  }, [initialRace]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom });
    setNom(''); // Réinitialiser le champ après soumission
  };

  return (
    <form  onSubmit={handleSubmit}>
      <TextInputField
        name="nom"
        label="Nom du service"
        value={initialRace}
        onChange={(e) => setNom(e.target.value)}
      />
      <button type="submit">
        {initialRace ? 'Modifier' : 'Créer'} la race
      </button>
    </form>
  );
};


