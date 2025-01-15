import React, { useState, useEffect } from 'react';
import { Horaire } from '../../../models/horaireInterface';

export const HoraireFormDelete: React.FC = () => {
  const [selectedHoraireId, setSelectedHoraireId] = useState<number>(null)
  const [horaires, setHoraires] = useState([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("jwt_token");
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Vous n'avez pas l'autorisation requise pour cette action.")
          return Promise.reject("Unauthorized");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setHoraires((prevHoraires) => prevHoraires.filter(horaire => horaire.id !== selectedHoraireId));
        setSelectedHoraireId(null);
        setSuccessMessage(data.success);
      }
    } catch (error) {
      if (error === "Unauthorized") return;
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <p className="alert alert-danger">{error}</p>}
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
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