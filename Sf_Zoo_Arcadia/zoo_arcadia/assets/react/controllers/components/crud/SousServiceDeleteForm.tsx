import React, { useEffect, useState } from 'react';

export const SousServiceDeleteForm = () => {
  const [selectedSousServiceId, setSelectedSousServiceId] = useState<number | null>(
    null
  );
  const [sousServices, setSousServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const token = localStorage.getItem("jwt_token")

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSousServiceId(selectedId);
  };
  useEffect(() => {
    const fetchSousService = async () => {
      try {
        const response = await fetch('/api/sousService', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {

          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setSousServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSousService();
  }, []);

  const handleDelete = async (sousServiceId) => {
    if (!selectedSousServiceId) {
      alert('Aucun ID de sousService fourni');
      return;
    }

    try {
      const response = await fetch(`/api/sousService/delete/${selectedSousServiceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Vous n'avez pas l'autorisation requise pour cette action.");
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        alert('SousService supprimé avec succès');

        // Mise à jour de la liste après suppression
        setSousServices(sousServices.filter(sousService => sousService.id !== selectedSousServiceId));
        setSelectedSousServiceId(null); // Réinitialiser la sélection
      } else {
        alert(data.message || 'Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement des sousServices...</p>;


  return (
    <div>
      <h1>Supprimer un SousService</h1>
      {error && <p className='alert alert-danger'>{error}</p>}
      {successMessage && <p className='alert alert-success'>{successMessage}</p>}

      {/* Sélectionner un sousService */}
      <select onChange={handleSelectChange} value={selectedSousServiceId ?? ''}>
        <option value="" disabled>
          Sélectionner un sousService
        </option>
        {sousServices.map((sousService) => (
          <option key={sousService.id} value={sousService.id}>
            {sousService.nom}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={!selectedSousServiceId}>
        Supprimer le sousService
      </button>
    </div>
  );
};