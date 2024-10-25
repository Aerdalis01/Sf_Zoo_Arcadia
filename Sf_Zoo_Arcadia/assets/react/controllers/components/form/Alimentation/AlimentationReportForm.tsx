import React, { useEffect, useState } from "react";
import { Alimentation } from "../../../../models/alimentationInterface";
import { Link } from "react-router-dom";
import { AnimalReportForm } from "./AnimalReportForm";

export function AlimentationReport() {
  const [reports, setReports] = useState<Alimentation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    fetch("/api/alimentation/")
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => setError("Erreur lors du chargement des rapports."));
  }, []);

  return (
    <div className="container">
      <h1>Rapports d'Alimentation</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nourriture</th>
            <th>Quantité</th>
            <th>Créé par</th>
            <th>Animal</th>
            <th>Date de création</th>
            <th>Heure de création</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.nourriture}</td>
              <td>{report.quantite}</td>
              <td>{report.createdBy}</td>
              <td>{report.animal}</td>
              <td>{report.date}</td>
              <td>{report.heure}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Bouton pour créer un nouveau rapport */}
      <AnimalReportForm />
    </div>
  );
}
