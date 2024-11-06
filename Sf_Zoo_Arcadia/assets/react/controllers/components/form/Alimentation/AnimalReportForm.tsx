import React, { useState, useEffect } from "react";

export function AnimalReportForm() {
  const [alimentationReports, setAlimentationReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  const [etat, setEtat] = useState("");
  const [etatDetail, setEtatDetail] = useState("");
  const [habitat, setHabitat] = useState("");
  const [commentaireHabitat, setCommentaireHabitat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/alimentation/reports")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des rapports d'alimentation");
        }
        return response.json();
      })
      .then((data) => {
        setAlimentationReports(data);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reportId = parseInt(e.target.value, 10);

    if (isNaN(reportId)) {
        setError("ID de rapport invalide.");
        return;
    }

    const selectedReport = alimentationReports.find(report => report.id === reportId);
    if (selectedReport) {
        setReportData(selectedReport);
    } else {
        setError("Rapport d'alimentation non trouvé.");
    }

    setSelectedReportId(reportId);
};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Vous devez être connecté pour soumettre ce formulaire.");
      return;
    }

    const formReport = new FormData();
    formReport.append("etat", etat);
    formReport.append("etatDetail", etatDetail);
    formReport.append("habitat", habitat);
    formReport.append("habitatComments[]", JSON.stringify([{ comment: commentaireHabitat }]));
    if (selectedReportId !== null) {
      formReport.append("alimentation", selectedReportId.toString()); 
    }

    try {
      const response = await fetch("/api/animalReport/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formReport,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSuccessMessage(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la soumission du formulaire.");
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la requête.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <h2>Créer un rapport vétérinaire</h2>
      
      <label htmlFor="alimentationReportSelect">Sélectionner un rapport d'alimentation :</label>
      <select id="alimentationReportSelect" onChange={handleSelectChange} value={selectedReportId || ""}>
        <option value="">Choisir un rapport</option>
        {alimentationReports.map((report) => (
          <option key={report.id} value={report.id}>
            {report.id} - {report.animal ? report.animal.nom : "Animal non disponible"}
          </option>
        ))}
      </select>

      
      {reportData && (
        <div>
          <h4>Rapport sélectionné :</h4>
          <p>Animal : {reportData.animal.nom}</p>
          <p>Nourriture : {reportData.nourriture}</p>
          <p>Quantité : {reportData.quantite}</p>
        </div>
      )}

      
      <div className="mb-3">
        <label htmlFor="etat" className="form-label">État de l'animal</label>
        <input
          type="text"
          className="form-control"
          id="etat"
          value={etat}
          onChange={(e) => setEtat(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="detailEtat" className="form-label">
          Détail de l'état de l'animal (facultatif)
        </label>
        <input
          type="text"
          className="form-control"
          id="etatDetail"
          value={etatDetail}
          onChange={(e) => setEtatDetail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="commentaireHabitat" className="form-label">État de l'habitat</label>
        <input
          type="text"
          className="form-control"
          id="commentaireHabitat"
          value={commentaireHabitat}
          onChange={(e) => setCommentaireHabitat(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Soumettre le rapport vétérinaire
      </button>
    </form>
  );
}
