import React, { useEffect, useState } from 'react';

export const AnimalDeleteForm = () => {
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(
    null
  );
  const [animal, setAnimal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedAnimalId(selectedId);
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/animal`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setAnimal(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchService();
  }, []);

  const handleDelete = async (animalId) => {
    if (!selectedAnimalId) {
      alert('Aucun ID d\'animal fourni');
      return;
    }

    try {
      const response = await fetch(`/api/animal/delete/${selectedAnimalId}`, {
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
        alert('Animal supprimé avec succès');
        
        setAnimal(animal.filter(animal => animal.id !== selectedAnimalId));
        setSelectedAnimalId(null); 
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
      <select onChange={handleSelectChange} value={selectedAnimalId ?? ''}>
        <option value="" disabled>
          Sélectionner un animal
        </option>
        {animal.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {animal.nom}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={!selectedAnimalId}>
        Supprimer l'animal
      </button>
    </div>
  );
};