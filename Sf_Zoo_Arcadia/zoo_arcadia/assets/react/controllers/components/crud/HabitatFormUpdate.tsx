import React, { useState, useRef, useEffect } from "react";
import { Habitat } from "../../../models/habitatInterface";
import { Animal } from "../../../models/animalInterface";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "../form/TextInputField";

export function HabitatFormUpdate() {
  const [formData, setFormData] = useState<Habitat>({
    id: 0,
    nom: "",
    description: "",
  });
  const [habitats, setHabitats] = useState<number[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [selectedHabitat, setSelectedHabitat] = useState<number | null>(null);
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

  useEffect(() => {
    fetch("/api/habitat/")
      .then((response) => response.json())
      .then((data) => setHabitats(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des habitats", error)
      );
  }, []);

  useEffect(() => {
    if (selectedHabitat !== null) {
      fetch(`/api/habitat/${selectedHabitat}`)
        .then((response) => response.json())
        .then((data) => {


          setFormData({
            id: data.id || 0,
            nom: data.nom || "",
            description: data.description || "",
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des détails de l'habitat:",
            error
          );
        });
    }
  }, [selectedHabitat]);

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );
    setSelectedAnimals(selectedOptions);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatId: number = Number(e.target.value);
    setSelectedHabitat(habitatId);
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
    const formHabitat = new FormData();
    formHabitat.append("nom", formData.nom);
    formHabitat.append("description", formData.description);

    selectedAnimals.forEach((animalId) => {
      formHabitat.append("animals[]", animalId.toString());
    });
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
    fetch(`/api/habitat/update/${formData.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formHabitat,
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");


        if (!response.ok) {
          if (response.status === 401) {
            setError("Vous n'avez pas l'autorisation requise pour cette action.")
            return Promise.reject("Unauthorized");
          }
        }

        // Si ce n'est pas du JSON, log la réponse brute
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          const textResponse = await response.text(); // Affiche le contenu brut

          throw new Error("Réponse non JSON reçue.");
        }
      })
      .then((data) => {
        if (data && data.status === "success") {
          setSuccess("habitat modifié avec succès !");
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
        setError("Erreur lors de la modification de l'habitat.");
        setSuccess(null);
        setResetImage(false);
      });
    formRef.current.reset();
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}
      <select onChange={handleSelectChange} value={selectedHabitat !== null ? String(selectedHabitat) : ''}>
        <option value="" disabled>
          Sélectionner un habitat
        </option>
        {habitats.map((habitat: any) => (
          <option key={habitat.id} value={habitat.id}>
            {habitat.nom}
          </option>
        ))}
      </select>

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
      <select name="animals" multiple onChange={handleAnimalChange}>
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
