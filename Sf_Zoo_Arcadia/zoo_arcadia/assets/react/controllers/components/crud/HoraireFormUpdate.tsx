import React, { useEffect, useState } from 'react';
import { Horaire } from '../../../models/horaireInterface';


export const HoraireFormUpdate: React.FC = () => {
  const [formData, setFormData] = useState<Horaire>({
    horaireTexte: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedHoraireId, setSelectedHoraireId] = useState<number>(null)
  const [horaires, setHoraires] = useState([]);

  useEffect(() => {
    fetch("/api/horaire")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHoraires(data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des animaux", error)
      );
  }, []);

  useEffect(() => {
    if (selectedHoraireId !== null) {
      fetch(`/api/horaire/${selectedHoraireId}`)
        .then((response) => response.json())
        .then((data) => {
          const horaireData = Array.isArray(data) ? data[0] : data; // Gère le cas où `data` pourrait ne pas être un tableau
          setFormData({
            id: horaireData.id || 0,
            horaireTexte: horaireData.horaireTexte || "",
          });
        })
        .catch((error) => {
          setError("Erreur lors du chargement des détails de l'horaire");
          console.error("Erreur lors du chargement des détails de l'horaire :", error);
        });
    }
  }, [selectedHoraireId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const horaireId = Number(e.target.value);
    setSelectedHoraireId(horaireId);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const formHoraire = new FormData();
    formHoraire.append('horaire', formData.horaireTexte);

    try {
      const response = await fetch(`/api/horaire/update/${selectedHoraireId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formHoraire,
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Erreur 401 : Vous n'avez pas l'autorisation requise pour cette action.");
          throw new Error("Vous n'avez pas l'autorisation requise pour cette action.");
        }
        // Affichez le contenu de la réponse pour plus de détails
        const errorText = await response.text();
        console.error('Erreur lors de l\'enregistrement de l\'horaire:', errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const savedHoraire = await response.json();
      setFormData({ horaireTexte: '' });
      setSuccessMessage('Horaire modifié avec succès !');
    } catch (error) {
      if (error === "Unauthorized") return;
      setError(error.message);
    }
  };
  return (
    <div>
      {error && <p className="alert alert-danger">{error}</p>}
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="horaire-select">Sélectionner un horaire :</label>
        <select id="horaire-select" onChange={handleSelectChange} defaultValue="">
          <option value="">Choisissez un horaire</option>
          {horaires.map((horaire) => (
            <option key={horaire.id} value={horaire.id}>
              {horaire.horaireTexte}
            </option>
          ))}
        </select>

        {selectedHoraireId !== null && (
          <>
            <label htmlFor="horaire-texte">Modifier le texte :</label>
            <textarea
              className='form-controll w-80'
              id="horaire-texte"
              name="horaireTexte"
              value={formData.horaireTexte}
              onChange={handleChange}
            />
            <button type="submit">Enregistrer</button>
          </>
        )}
      </form>
    </div>
  );
};