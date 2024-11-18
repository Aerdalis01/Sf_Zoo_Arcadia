import React, { useEffect, useState } from 'react';

interface AnimalStat {
  id: number;
  nom: string;
  visites: number;
  imagePath: string | null;
}

export const Reporting: React.FC = () => {
  const [animalStats, setAnimalStats] = useState<AnimalStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalStats = async () => {
      try {
        const response = await fetch('/api/reporting');
        if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques de visites.");

        const data = await response.json();
        setAnimalStats(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalStats();
  }, []);

  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <div>
      <h2>Statistiques de visites des animaux</h2>
      <table className="table admin-table">
        <thead>
          <tr>
            <th>Nom de l'animal</th>
            <th>Nombre de visites</th>
          </tr>
        </thead>
        <tbody>
          {animalStats.map((stat) => (
            <tr key={stat.id}>
              <td>{stat.nom}</td>
              <td>{stat.visites}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
