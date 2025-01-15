import { Alimentation } from "../../../../models/alimentationInterface";
import { TextInputField } from "../TextInputField";
import React, { useState, useEffect, useRef } from "react";
import { Animal } from "../../../../models/animalInterface";

export function AlimentationForm() {
  const [formData, setFormData] = useState<Alimentation>({
    id: 0,
    nourriture: "",
    quantite: "",
    idAnimal: "",
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [animal, setAnimal] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Vous devez être connecté pour soumettre ce formulaire.");
      return;
    }
    try {
      const formAlimentation = new FormData();
      formAlimentation.append("nourriture", formData.nourriture);
      formAlimentation.append("quantite", formData.quantite);
      formAlimentation.append("idAnimal", formData.idAnimal);

      const response = await fetch("/api/alimentation/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formAlimentation,
      });

      const contentType = response.headers.get("content-type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setSuccessMessage("Rapport d'alimentation envoyé avec succès !");
          formRef.current?.reset();
          setFormData({ id: 0, nourriture: "", quantite: "", idAnimal: "" });
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        } else {
          setSuccessMessage("Rapport envoyé, mais réponse non-JSON.");
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();

          if (response.status === 401) {
            setError("Vous n'avez pas l'autorisation requise pour cette action.");
          } else if (response.status === 404) {
            setError("Ressource introuvable.");
          } else {
            setError(errorData.message || `Erreur HTTP ${response.status}.`);
          }
        } else if (!contentType) {
          console.warn("Réponse sans en-tête Content-Type reçue :", await response.text());
          setError("Erreur lors de la soumission du formulaire, réponse non-JSON reçue.");
        } else {
          console.warn("Réponse inattendue :", await response.text());
          setError("Erreur lors de la soumission du formulaire, réponse non-JSON reçue.");
        }
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la requête.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Formulaire de l'alimentation des animaux</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="container-fluid connexion d-flex flex-column  align-items-center py-5">
        <form id="alimentation-form" className="col-10 d-flex flex-column  align-items-center my-auto" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3 col-9">
            <TextInputField
              form-label fs-5
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
          <hr />
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
          <hr />
          <div className="col-12 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
