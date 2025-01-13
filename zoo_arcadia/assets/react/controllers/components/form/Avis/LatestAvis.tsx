import React, { useEffect, useState } from 'react';

export const LatestAvis: React.FC = () => {
  const [latestAvis, setLatestAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAvis = async () => {
      try {
        const response = await fetch('/api/avis/latest-avis', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des derniers avis.');
        }

        const data = await response.json();
        setLatestAvis(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAvis();
  }, []);

  if (loading) return <p>Chargement des derniers avis...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Derniers Avis</h2>
      <ul>
        {latestAvis.length > 0 ? (
          latestAvis.map((item) => (
            <li key={item.id}>
              <p><strong>{item.nom}</strong>: {item.avis} (Note : {item.note}/5)</p>
            </li>
          ))
        ) : (
          <p>Aucun avis disponible pour le moment</p>
        )}
      </ul>
    </div>
  );
};
