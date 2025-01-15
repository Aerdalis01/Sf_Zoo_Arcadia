import React, { useState, useEffect } from "react";

export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [animalId, setAnimalId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    fetchReports();
  }, [animalId, date, sortBy, sortOrder]);

  const fetchReports = async () => {
    let query = "/api/animalReport/view";
    const params = [];

    if (animalId) {
      params.push(`animalId=${animalId}`);
    }

    if (date) {
      params.push(`date=${date}`);
    }

    params.push(`sortBy=${sortBy}`);
    params.push(`sortOrder=${sortOrder}`);

    if (params.length > 0) {
      query += `?${params.join("&")}`;
    }

    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des rapports.");
      }
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container table-admin">
      <h1>Comptes Rendus Vétérinaires</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div>
        <label>
          Trier par :
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date</option>
            <option value="animal.nom">Animal</option>{" "}
            {/* Si animal.nom est la propriété correcte */}
          </select>
        </label>
        <label>
          Ordre :
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="ASC">Ascendant</option>
            <option value="DESC">Descendant</option>
          </select>
        </label>
      </div>

      <table className="table admin-table scroll-container overflow-auto">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Nourriture</th>
            <th>Quantité</th>
            <th>État</th>
            <th>Detail État</th>
            <th>Commentaire habitat</th>
            <th>Date de création</th>
            <th>Heure de création</th>
            <th>Créé par</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report.id}>
              <td>{report.animalNom}</td>
              <td>{report.nourriture}</td>
              <td>{report.quantite}</td>
              <td>{report.etat}</td>
              <td>{report.etatDetail}</td>
              <td>
                {report.habitatComments && report.habitatComments.length > 0
                  ? report.habitatComments.map((comment, index) => (
                    <p key={index}>{comment.content}</p>
                  ))
                  : "Aucun commentaire"}
              </td>
              <td>{report.dateCreated ? report.dateCreated : 'Date inconnue'}</td>
              <td>{report.heureCreated ? report.heureCreated : 'Heure inconnue'}</td>
              <td>{report.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
