import React, { useState, useRef, useEffect } from "react";
import { Habitat } from "../../../models/habitatInterface";
import { Animal } from "../../../models/animalInterface";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "../form/TextInputField";


export function HabitatForm() {
  const [formData, setFormData] = useState<Habitat>({
    id: 0,
    nom: "",
    description: "",
  });

  const [resetImage, setResetImage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef(null);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetch("/api/animal")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAnimals(data);
      })
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const formHabitat = new FormData();
    formHabitat.append("nom", formData.nom);
    formHabitat.append("description", formData.description);
    if (file) {
      const originalFilename = file.name.split(".").slice(0, -1).join(".");
      const extension = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
      const imageSubDirectory = `/services`;

      formHabitat.append("file", file);
      formHabitat.append("nomImage", imageNameGenerated);
      formHabitat.append("image_sub_directory", imageSubDirectory);
    }
    formHabitat.forEach((value, key) => {
    });
    fetch("/api/habitat/new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formHabitat,
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            setError("Vous n'avez pas l'autorisation requise pour cette action.")
            return Promise.reject("Unauthorized");
          }
        }
        const contentType = response.headers.get("content-type");

        return contentType && contentType.includes("application/json")
          ? response.json()
          : Promise.reject("Réponse non JSON reçue.");
      })
      .then((data) => {
        if (data && data.status === "success") {
          setSuccess("Habitat ajouté avec succès !");
          setFormData({
            id: 0,
            nom: "",
            description: "",
          });
          setFile(null);
          setError(null);
          setResetImage(true);

          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          throw new Error("Erreur : Réponse inattendue.");
        }
      })

      .catch((error) => {
        if (error === "Unauthorized") return;
        setError("Erreur lors de l'ajout de l'habitat.");
        setSuccess(null);
        setResetImage(false);
      });
    formRef.current.reset();
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}
      <TextInputField
        name="nom"
        label="Nom de l'habitat"
        value={formData.nom}
        onChange={handleChange}
      />
      <TextInputField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <ImageForm
        serviceName={formData.nom}
        onImageSelect={setFile}
        resetImage={resetImage}
      />

      <label>Animaux associés :</label>
      <select name="animals" multiple onChange={handleChange}>
        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {animal.nom}
          </option>
        ))}
      </select>

      <button type="submit">Soumettre</button>


    </form>
  );
}
