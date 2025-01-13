import React, { useState, useRef } from "react";
import { Service } from "../../../models/serviceInterface";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "../form/TextInputField";
import { HoraireField } from "./HoraireField";
import { CheckBoxField } from "../form/CheckBoxFieldProps";


export function ServiceForm() {
  const [formData, setFormData] = useState<Service>({
    id: 0,
    nom: "",
    titre: "",
    description: "",
    horaireTexte: "",
    carteZoo: false,
  });
  const [resetImage, setResetImage] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef(null);
  const [isCarteZoo, setIsCarteZoo] = useState(false);
  const [horaireTexte, setHoraireTexte] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const resetForm = () => {
    setFile(null);
    setResetImage(true);
    setIsCarteZoo(false);
    setError(null);
    setSuccessMessage(null);
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCarteZoo(e.target.checked);
    setFormData({ ...formData, carteZoo: e.target.checked ? true : false });
  };

  const handleHoraireTexteChange = (value: string) => {
    setHoraireTexte(value);
    setFormData((prev) => ({
      ...prev,
      horaireTexte: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const formService = new FormData();
    formService.append("nom", formData.nom);

    if (formData.horaireTexte) {
      formService.append("horaire", formData.horaireTexte);
    }
    if (formData.titre) {
      formService.append("titre", formData.titre);
    }
    if (formData.description) {
      formService.append("description", formData.description);
    }
    if (formData.carteZoo) {
      formService.append("carteZoo", formData.carteZoo ? "1" : "0");
    }
    if (file) {
      // Récupérer le nom original du fichier téléchargé sans l'extension
      const originalFilename = file.name.split(".").slice(0, -1).join(".");
      const extension = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
      const imageSubDirectory = `/services`;

      formService.append("file", file);
      formService.append("nomImage", imageNameGenerated);
      formService.append("image_sub_directory", imageSubDirectory);
    }
    fetch("/api/service/new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formService,
    })
    .then(response => {
      
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json(); 
      } else {
        throw new Error('Réponse non-JSON reçue du serveur');
      }
    })
    .then((data) => {
      if (data.status === "success") {
        setSuccessMessage("Service ajouté avec succès !");
        resetForm();
      } else {
        throw new Error("Réponse inattendue.");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la soumission du formulaire:", error);
      setError("Erreur lors de l'ajout du service.");
      setSuccessMessage(null);
    });
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <TextInputField
        name="nom"
        label="Nom du service"
        value={formData.nom}
        onChange={handleChange}
      />
      <TextInputField
        name="titre"
        label="Titre du service"
        value={formData.titre}
        onChange={handleChange}
      />
      <TextInputField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <HoraireField
        horaireTexte={horaireTexte}
        setHoraireTexte={handleHoraireTexteChange}
        label="Horaires du service"
      />

      <CheckBoxField
        label="C'est une carte du zoo"
        checked={isCarteZoo}
        onChange={handleCheckboxChange}
      />
      <ImageForm serviceName={formData.nom} onImageSelect={setFile} resetImage={resetImage} />
      <button type="submit">Soumettre</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
            {successMessage}
        </p>}
    </form>
  );
}
