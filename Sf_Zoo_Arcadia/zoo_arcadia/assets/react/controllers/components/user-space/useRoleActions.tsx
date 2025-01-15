// hooks/useRoleActions.ts

import { useState, useEffect } from 'react';

export const useRoleActions = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {

    const fetchAvis = async () => {
      try {
        // Récupération du token JWT depuis le stockage local
        const token = localStorage.getItem('jwt_token');
        console.log(localStorage.getItem('jwt_token'));

        // Vérification de la présence du token
        if (!token) {
          throw new Error('Token JWT manquant. Veuillez vous authentifier.');
        }

        // Envoi de la requête avec le header Authorization
        const response = await fetch('/api/avis', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis.');
        }

        const data = await response.json();
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
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Vous n'avez pas l'autorisation requise pour cette action.");
          setTimeout(() => setError(''), 3000); // Efface l'erreur après 3 secondes
          return;
        }
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
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Vous n'avez pas l'autorisation requise pour cette action.");
          setTimeout(() => setError(''), 3000); // Efface l'erreur après 3 secondes
          return;
        }

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
    error,
    setError,
  };
};
