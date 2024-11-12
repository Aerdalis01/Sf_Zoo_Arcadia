import React, { useEffect, useState } from 'react';

interface VisiteStats {
  animalId: number;
  visites: number;
  nom: string;
}

export const Reporting: React.FC = () => {
  const [visiteStats, setVisiteStats] = useState<VisiteStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisiteStats = async () => {
      try {
        const response = await fetch('/api/reporting');
        if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques de visites.");

        const data = await response.json();
        setVisiteStats(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisiteStats();
  }, []);

  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <div>
      <h2>Statistiques de visites des animaux</h2>
      <table className="table admin-table">
        <thead>
          <tr>
            <th>Animal ID</th>
            <th>Nom de l'animal</th>
            <th>Nombre de visites</th>
          </tr>
        </thead>
        <tbody>
          {visiteStats.map((stat) => (
            <tr key={stat.animalId}>
              <td>{stat.animalId}</td>
              <td>{stat.nom}</td>
              <td>{stat.visites}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};