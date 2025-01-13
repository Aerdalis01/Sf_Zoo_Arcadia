import React, { useState, useEffect } from 'react';
import { Horaire } from '../../../models/horaireInterface';

export const HoraireFormDelete: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [selectedHoraireId, setSelectedHoraireId] = useState<number>(null)
  const [horaires, setHoraires] = useState([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const horaireId = Number(e.target.value);
    setSelectedHoraireId(horaireId);
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/horaire`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setHoraires(data);
       
      } catch (err) {
        setError(err.message);
      
      }
    };

    fetchService();
  }, []);

  const handleDelete = async () => {
    if (!selectedHoraireId) {
      alert('Aucun ID d\'horaire fourni');
      return;
    }
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`/api/horaire/delete/${selectedHoraireId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) { 
        setHoraires((prevHoraires) => prevHoraires.filter(horaire => horaire.id !== selectedHoraireId));
        setSelectedHoraireId(null);
        setSuccessMessage(data.success); 
      }
    } catch (error) {
      setError(error.message);
      console.error('Erreur lors de la suppression :', error);
      
    }
  };
  
  return (
    <div>
       {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      <label>Sélectionnez l'horaire à supprimer :</label>
      <select onChange={(e) => setSelectedHoraireId(Number(e.target.value))} value={selectedHoraireId ?? ''}>
        <option value="" disabled>Choisir un horaire</option>
        {horaires.map((horaire) => (
          <option key={horaire.id} value={horaire.id}>
            {`ID: ${horaire.id} - ${horaire.horaireTexte}`}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={selectedHoraireId === null}>Supprimer</button>
    </div>
  );
};