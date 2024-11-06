import React, { useEffect, useState } from "react";
import { Alimentation } from "../../../../models/alimentationInterface";
import { Link } from "react-router-dom";
import { AnimalReportForm } from "./AnimalReportForm";



export function AlimentationReport() {
  const [reports, setReports] = useState<Alimentation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showId, setShowId] = useState(true);
  const [showNourriture, setShowNourriture] = useState(true);
  const [showQuantite, setShowQuantite] = useState(true);
  const [showCreatedBy, setShowCreatedBy] = useState(true);
  const [showAnimal, setShowAnimal] = useState(true);
  const [showFormattedDate, setShowFormattedDate] = useState(true);
  const [showFormattedHeure, setShowFormattedHeure] = useState(true);
  const [showIsUsed, setShowIsUsed] = useState(true);

  const toggleColumn = (column) => {
    switch (column) {
      case "id":
        setShowId(!showId);
        break;
      case "animal":
        setShowAnimal(!showAnimal);
        break;
      case "nourriture":
        setShowNourriture(!showNourriture);
        break;
      case "quantite":
        setShowQuantite(!showQuantite);
        break;
      case "date":
        setShowFormattedDate(!showFormattedDate);
        break;
      case "heure":
        setShowFormattedHeure(!showFormattedHeure);
        break;
      case "createdBy":
        setShowCreatedBy(!showCreatedBy);
        break;
      case "isUsed":
        setShowIsUsed(!showIsUsed);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    fetch("/api/alimentation/reports")
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => setError("Erreur lors du chargement des rapports."));
  }, []);

  const handleAnimalReportSubmit = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, isUsed: true } : report
      )
    );
  };
  return (
    <div className="container">
      <h1>Rapports d'Alimentation</h1>

      <div>
        <button onClick={() => toggleColumn("id")}>id</button>

        <button onClick={() => toggleColumn("nourriture")}>Nourriture</button>
        <button onClick={() => toggleColumn("quantite")}>Quantité</button>
        <button onClick={() => toggleColumn("date")}>Date</button>
        <button onClick={() => toggleColumn("heure")}>Heure</button>
        <button onClick={() => toggleColumn("createdBy")}>Créé par</button>
        <button onClick={() => toggleColumn("isUsed")}>Utilisé</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <div className="alimentation-table">
        <table className="table">
          <thead>
            <tr>
              <th className={!showId ? "hidden" : ""}>Id</th>
              <th className={!showAnimal ? "hidden" : ""}>Animal</th>
              <th className={!showNourriture ? "hidden" : ""}>Nourriture</th>
              <th className={!showQuantite ? "hidden" : ""}>Quantité</th>
              <th className={!showFormattedDate ? "hidden" : ""}>
              Date de création
              </th>
              <th className={!showFormattedHeure ? "hidden" : ""}>
                Heure de création
              </th>
              <th className={!showCreatedBy ? "hidden" : ""}>Créé par</th>
              <th className={!showIsUsed ? "hidden" : ""}>Utilisé</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className={!showId ? "hidden" : ""}>{report.id}</td>
                <td className={!showAnimal ? "hidden" : ""}>
                  {report.animal ? report.animal.nom : "N/A"}
                </td>
                <td className={!showNourriture ? "hidden" : ""}>
                  {report.nourriture}
                </td>
                <td className={!showQuantite ? "hidden" : ""}>
                  {report.quantite}
                </td>
                <td className={!showFormattedDate ? "hidden" : ""}>
                  {report.formattedDate
                    ? report.formattedDate
                    : "Date inconnue"}
                </td>
                <td className={!showFormattedHeure ? "hidden" : ""}>
                  {report.formattedHeure
                    ? report.formattedHeure
                    : "Heure inconnue"}
                </td>
                <td className={!showCreatedBy ? "hidden" : ""}>
                  {report.createdBy}
                </td>
                <td className={!showIsUsed ? "hidden" : ""}>
                  <input type="checkbox" checked={report.isUsed || false} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimalReportForm onSubmit={handleAnimalReportSubmit} />
    </div>
  );
}
