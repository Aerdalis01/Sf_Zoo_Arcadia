// hooks/useRoleActions.ts

import { useState, useEffect } from 'react';

export const useRoleActions = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect (() => {

    const fetchAvis = async () => {
      try {
        const response = await fetch('/api/avis', {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis.');
        }
  
        const data = await response.json();
        console.log('Données récupérées :', data);
  
        setAvis(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAvis();
  }, []);


  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/avis/${id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la validation de l\'avis.');
      }

      // Mettre à jour l'avis localement dans l'état
      setAvis((prevAvis) =>
        prevAvis.map((item) =>
          item.id === id ? { ...item, valid: true } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour supprimer un avis
  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/avis/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'avis.');
      }
      
      setAvis((prevAvis) => prevAvis.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleApprove,
    handleReject,
    avis,
    setAvis,
  };
};
