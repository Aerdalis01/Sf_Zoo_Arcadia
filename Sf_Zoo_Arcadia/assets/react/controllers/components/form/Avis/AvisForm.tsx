import React, { useState } from 'react';
import { Avis } from '../../../../models/avisInterface'
import { TextInputField } from "../TextInputField";

export const renderStars = (note) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (i <= note) {
      // Afficher une étoile pleine si la note est supérieure ou égale à l'index actuel
      stars.push(<img key={i} src="/uploads/images/svgDeco/star-filled.svg" alt="étoile pleine" width="20" />);
    } else {
      // Afficher une étoile vide sinon
      stars.push(<img key={i} src="/uploads/images/svgDeco/star.svg" alt="étoile vide" width="20" />);
    }
  }

  return stars;
};
export function AvisForm ({ handleFormToggle, onFormSuccess }) {
  const[formData, setFormData] = useState<Avis>({
    id: 0,
    nom: "",
    avis: "",
    note: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStarClick = (value: number) => {
    setFormData({
      ...formData,
      note: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true); 
    setError(null);
    

    const formAvis = new FormData();
    formAvis.append("nom", formData.nom)
    formAvis.append("avis", formData.avis)
    formAvis.append("note", formData.note.toString())
      
    fetch("/api/avis/new", {
      method: "POST",
      body: formAvis,
    })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        handleFormToggle();
        onFormSuccess("Avis créé avec succès !");
      } else {
        setError('Erreur lors de la création de l\'avis.');
          console.error('Erreur lors de la création de l\'avis:', response.status);
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la requête:', error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  


  return (
    <div className="modal-form col-6">
      <img
        className="modal-form--exit"
        src="/uploads/images/svgDeco/croix.svg"
        alt="Image d'une croix"
        onClick={handleFormToggle}
      />
      <form id="avis-form" className="row g-3" onSubmit={handleSubmit}>

      {error && <div className="alert alert-danger">{error}</div>}
        <div className="col-md-6">
          <TextInputField
            name="nom"
            label="Nom"
            value={formData.nom}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-12">
        <TextInputField
            name="avis"
            label="Commentaire"
            value={formData.avis}
            onChange={handleInputChange}
          />
        </div>
        <div className="note d-flex flex-column align-items-center">
          <div className="content-etoile d-inline-flex justify-content-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value}>
                <img
                  className="etoile"
                  src={value <= formData.note ? '/uploads/images/svgDeco/star-filled.svg' : '/uploads/images/svgDeco/star.svg'}
                  alt={`étoile ${value}`}
                  onClick={() => handleStarClick(value)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
        <input type="hidden" id="rating" name="rating" value={formData.note} />
        <div className="col-12 d-flex justify-content-center">
          <button type="submit" className="btn btn-warning rounded-5 fw-semibold" disabled={isSubmitting}>{isSubmitting ? "Envoi en cours..." : "Envoyer"}</button>
          
        </div>
      </form>
    </div>
  );
};
