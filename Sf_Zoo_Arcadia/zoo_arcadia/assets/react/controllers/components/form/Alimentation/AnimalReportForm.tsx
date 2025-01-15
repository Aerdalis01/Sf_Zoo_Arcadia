import React, { useState, useEffect } from "react";

type AnimalReportFormProps = {
  onSubmit: (reportId: number) => void;
};

export function AnimalReportForm({ onSubmit }: AnimalReportFormProps) {
  const [alimentationReports, setAlimentationReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  const [etat, setEtat] = useState("");
  const [etatDetail, setEtatDetail] = useState("");
  const [habitat, setHabitat] = useState("");
  const [commentaireHabitat, setCommentaireHabitat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [animalId, setAnimalId] = useState<number | null>(null);

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

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reportId = parseInt(e.target.value, 10);

    if (isNaN(reportId)) {
      setError("ID de rapport invalide.");
      return;
    }

    const selectedReport = alimentationReports.find(report => report.id === reportId);
    if (selectedReport) {
      setReportData(selectedReport);
      setSelectedReportId(reportId);
      setError(null);

      try {
        const response = await fetch(`/api/animalReport/view/${reportId}`);
        if (selectedReport.animal && selectedReport.animal.id) {
          setAnimalId(selectedReport.animal.id);
        } else {
          setAnimalId(null);
          setError("Animal non trouvé pour ce rapport d'alimentation.");
        }
        if (response.ok) {
          const animalReport = await response.json(); // Récupérez directement le JSON
          const lastComment = animalReport.habitatComments.find(comment => comment.content) || animalReport.habitatComments[0];
          setCommentaireHabitat(lastComment.content || "");
          // Assurez-vous que les données existent avant de les définir
          setEtat(animalReport.etat || "");
          setEtatDetail(animalReport.etatDetail || "");
          const lastNonEmptyComment = animalReport.habitatComments.reverse().find(comment => comment.content);
          setCommentaireHabitat(lastNonEmptyComment ? lastNonEmptyComment.content : "");
          setAnimalId(animalReport.animalId || null);
        }
      } catch (error) {
        console.error("Erreur de requête:", error);

      }
    } else {
      setError("Rapport d'alimentation non trouvé.");
      // Réinitialiser les champs si le rapport n'est pas trouvé
      setEtat("");
      setEtatDetail("");
      setCommentaireHabitat("");
      setAnimalId(null);
    }
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
    formReport.append("habitatComments", commentaireHabitat);
    if (animalId !== null) {
      formReport.append("id", animalId.toString());
    }


    formReport.forEach((value, key) => {

    });
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
        setSuccessMessage(data.message);
        setError(null);

        if (selectedReportId !== null) {
          onSubmit(selectedReportId);
        }
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setError("Vous n'avez pas l'autorisation requise pour cette action.");
          return;
        }
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
      <h2>{selectedReportId && reportData?.isUsed ? "Modifier le rapport vétérinaire" : "Créer un rapport vétérinaire"}</h2>

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
        {selectedReportId && reportData?.isUsed ? "Mettre à jour le rapport vétérinaire" : "Soumettre le rapport vétérinaire"}
      </button>
    </form>
  );
}
