import React, { useEffect, useState } from 'react';

export const ServiceDeleteForm = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    console.log("Service sélectionné avec l'ID :", selectedId);
    setSelectedServiceId(selectedId);
  };
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch('/api/service', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchService();
  }, []);

  const handleDelete = async (serviceId) => {
    if (!selectedServiceId) {
      alert('Aucun ID de service fourni');
      return;
    }

    try {
      const response = await fetch(`/api/service/delete/${selectedServiceId}`, {
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
        alert('Service supprimé avec succès');
        
        // Mise à jour de la liste après suppression
        setServices(services.filter(service => service.id !== selectedServiceId));
        setSelectedServiceId(null); // Réinitialiser la sélection
      } else {
        alert(data.message || 'Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement des services...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Supprimer un Service</h1>
      {/* Sélectionner un service */}
      <select onChange={handleSelectChange} value={selectedServiceId ?? ''}>
        <option value="" disabled>
          Sélectionner un service
        </option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.nom}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={!selectedServiceId}>
        Supprimer le service
      </button>
    </div>
  );
};