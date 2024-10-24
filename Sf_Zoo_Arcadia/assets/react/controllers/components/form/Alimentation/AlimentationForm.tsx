import { Alimentation } from "../../../../models/alimentationInterface";
import { TextInputField } from "../TextInputField";
import React, { useState, useEffect } from "react";
import { Animal } from "../../../../models/animalInterface";
import { jwtDecode } from "jwt-decode";

export function AlimentationForm() {
  const [formData, setFormData] = useState<Alimentation>({
    id: 0,
    nourriture: "",
    quantite: "",
    // createdBy: "",
    idAnimal: "",
  });
  const [animal, setAnimal] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  // useEffect(() => {
  //   const token = localStorage.getItem("jwt_token");
  //   if (token) {
  //     try {
  //       const decodedToken: any = jwtDecode(token);
  //       console.log("Token décodé :", decodedToken);
        
  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         createdBy: decodedToken.email,
  //       }));
  //     } catch (error) {
  //       console.error("Erreur lors du décodage du token JWT", error);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    fetch("/api/animal/")
    .then((response) => response.json())
    .then((data) => setAnimal(data))
    .catch((error) =>
      console.error("Erreur lors du chargement des animaux", error)
    );
}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulaire soumis");
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Vous devez être connecté pour soumettre ce formulaire.");
      return;
    }
    try {
      console.log("Formulaire en cours d'envoi...");
    const formAlimentation = new FormData();
    formAlimentation.append("nourriture", formData.nourriture);
    formAlimentation.append("quantite", formData.quantite);
    // formAlimentation.append("createdBy", formData.createdBy);
    formAlimentation.append("idAnimal", formData.idAnimal);

    
      const response = await fetch("/api/alimentation/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formAlimentation,
      });

      console.log("Réponse reçue :", response);
      const contentType = response.headers.get("content-type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Données JSON reçues :", data);
          setSuccessMessage("Rapport d'alimentation envoyé avec succès !");
        } else {
          
          setSuccessMessage("Rapport envoyé, mais réponse non-JSON.");
          console.log("La réponse n'est pas JSON");
        }
      } else {
        // Si la réponse n'est pas correcte, on vérifie le type de contenu
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          setError(errorData.message || "Erreur lors de la soumission du formulaire.");
        } else {
          setError("Erreur lors de la soumission du formulaire, réponse non-JSON reçue.");
        }
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la requête.");
      console.error(error);
    }
  };
  

  return (
    <form id="alimentation-form" className="row g-3" onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="col-md-6">
        <TextInputField
          name="nourriture"
          label="Nourriture"
          value={formData.nourriture}
          onChange={handleInputChange}
        />
      </div>
      <div className="col-12">
        <TextInputField
          name="quantite"
          label="Quantité"
          value={formData.quantite}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="animal">Animal :</label>
        <select
          id="animal"
          name="idAnimal"
          value={formData.idAnimal}
          onChange={handleChange}
        >
          <option value="">Choisir un animal</option>
          {animal.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <button type="submit" className="btn btn-warning rounded-5 fw-semibold">
          Envoyer
        </button>
      </div>
    </form>
  );
}
