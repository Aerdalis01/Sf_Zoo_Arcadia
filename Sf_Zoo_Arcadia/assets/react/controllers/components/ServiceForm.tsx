import React, { useState, useRef } from "react";
import { Service } from "../../models/serviceInterface";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "./form/TextInputField";
import { HoraireField } from "./form/HoraireField";
import { CheckBoxField } from "./form/CheckBoxFieldProps";

export function ServiceForm() {
  const [formData, setFormData] = useState<Service>({
    id: 0,
    nom: "",
    titre: "",
    description: "",
    horaire: "",
    carteZoo: false,
  });
  const [resetImage, setResetImage] = useState(false);
  const formRef = useRef(null);
  const [isCarteZoo, setIsCarteZoo] = useState(false);
  const [horaireNom1, setHoraireNom1] = useState("");
  const [horaireNom2, setHoraireNom2] = useState("");
  const [horaires1, setHoraires1] = useState<{ nom: string; heure: string }[]>(
    []
  );
  const [horaires2, setHoraires2] = useState<{ nom: string; heure: string }[]>(
    []
  );
  const [horaireInput1, setHoraireInput1] = useState("");
  const [horaireInput2, setHoraireInput2] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ajouterHoraire1 = () => {
    if (horaireInput1 && horaireNom1) {
      setHoraires1((prevHoraires) => [
        ...prevHoraires,
        { nom: horaireNom1, heure: horaireInput1 },
      ]);
      setHoraireInput1("");
    }
  };
  const ajouterHoraire2 = () => {
    if (horaireInput2 && horaireNom2) {
      setHoraires2((prevHoraires) => [
        ...prevHoraires,
        { nom: horaireNom2, heure: horaireInput2 },
      ]);
      setHoraireInput2("");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCarteZoo(e.target.checked); // Mettre à jour l'état pour la carte du zoo
    setFormData({ ...formData, carteZoo: e.target.checked ? true : false }); // Enregistrer la valeur booléenne dans formData
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
    const formService = new FormData();
    formService.append("nom", formData.nom);
    if (horaires1.length > 0 || horaires2.length > 0) {
      const horaires = {
        horaire1: horaires1.length > 0 ? horaires1 : null,
        horaire2: horaires2.length > 0 ? horaires2 : null,
      };
      console.log("Objets horaires à envoyer : ", horaires);
      formService.append("horaire", JSON.stringify(horaires));
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
      // Récupérer l'extension du fichier
      const extension = file.name.split(".").pop();
      //Appel du timestamp pour générer un nom d'image unique
      const timestamp = new Date().getTime();
      //utilisation du timestamp dans le nom de l'image
      const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
      const imageSubDirectory = `/services`;

      formService.append("file", file);
      formService.append("nomImage", imageNameGenerated);
      formService.append("image_sub_directory", imageSubDirectory);
      console.log("Nom de l'image généré :", imageNameGenerated);
    }
    formService.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    fetch("/api/service/new", {
      method: "POST",
      body: formService,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
        }
        const contentType = response.headers.get("content-type");

        return contentType && contentType.includes("application/json")
          ? response.json()
          : Promise.reject("Réponse non JSON reçue.");
      })
      .then((data) => {
        if (data && data.status === "success") {
          setSuccessMessage("Service ajouté avec succès !");
          setFormData({
            id: 0,
            nom: "",
            titre: "",
            description: "",
            horaire: "",
            carteZoo: false,
          });
          setHoraires1([]);
          setHoraires2([]);
          setFile(null);
          setError(null);
          setResetImage(true);

          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        } else {
          throw new Error("Erreur : Réponse inattendue.");
        }
      })

      .catch((error) => {
        console.error("Erreur lors de la soumission du formulaire:", error);
        setError("Erreur lors de l'ajout du service.");
        setSuccessMessage(null);
      });
      formRef.current.reset();
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
        horaireNom={horaireNom1}
        horaireInput={horaireInput1}
        setHoraireNom={setHoraireNom1}
        setHoraireInput={setHoraireInput1}
        horaires={horaires1}
        ajouterHoraire={ajouterHoraire1}
        label="Ajouter Horaire 1"
      />

      <HoraireField
        horaireNom={horaireNom2}
        horaireInput={horaireInput2}
        setHoraireNom={setHoraireNom2}
        setHoraireInput={setHoraireInput2}
        horaires={horaires2}
        ajouterHoraire={ajouterHoraire2}
        label="Ajouter Horaire 2"
      />

      <CheckBoxField
        label="C'est une carte du zoo"
        checked={isCarteZoo}
        onChange={handleCheckboxChange}
      />
      <ImageForm serviceName={formData.nom} onImageSelect={setFile} resetImage={resetImage}/>
      <button type="submit">Soumettre</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
