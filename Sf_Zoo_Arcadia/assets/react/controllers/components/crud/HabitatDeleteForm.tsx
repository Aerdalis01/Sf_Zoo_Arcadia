import React, { useEffect, useState } from 'react';
import { CheckBoxField } from "../form/CheckBoxFieldProps";
export const HabitatDeleteForm = () => {
  const [selectedHabitatId, setSelectedHabitatId] = useState<number | null>(
    null
  );
  const [habitats, setHabitats] = useState([]);
  const [animalDelete, setAnimalDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimalDelete(e.target.checked); 
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    console.log("Habitat sélectionné avec l'ID :", selectedId);
    setSelectedHabitatId(selectedId);
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/habitat`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setHabitats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchService();
  }, []);

  const handleDelete = async (animalId) => {
    if (!selectedHabitatId) {
      alert('Aucun ID d\'animal fourni');
      return;
    }

    try {
      const response = await fetch(`/api/habitat/delete/${selectedHabitatId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        alert('Habitat supprimé avec succès');
        
        setHabitats(habitats.filter(habitat => habitat.id !== selectedHabitatId));
        setSelectedHabitatId(null); 
      } else {
        alert(data.message || 'Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement de la page...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Supprimer un Animal</h1>
      {/* Sélectionner un service */}
      <select onChange={handleSelectChange} value={selectedHabitatId ?? ''}>
        <option value="" disabled>
          Sélectionner un animal
        </option>
        {habitats.map((habitat) => (
          <option key={habitat.id} value={habitat.id}>
            {habitat.nom}
          </option>
        ))}
      </select>

      <CheckBoxField
        label="Cochez pour supprimer tous les animaux de l'habitat:"
        checked={animalDelete}
        onChange={handleCheckboxChange}
      />
{/* Affichage conditionnel basé sur l'état */}
{animalDelete ? (
        <p>L'animal sera supprimé</p>
      ) : (
        <p>L'animal ne sera pas supprimé</p>
      )}
      <button onClick={handleDelete} disabled={!selectedHabitatId}>
        Supprimer l'habitat
      </button>

      
    </div>
  );
};