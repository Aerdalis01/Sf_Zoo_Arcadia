import React, { useState, useRef, useEffect } from "react";
import { Animal } from "../../../models/animalInterface";
import { Habitat } from "../../../models/habitatInterface";
import { TextInputField } from "../form/TextInputField";
import { ImageForm } from "./ImageForm";
import { fetchRaces, updateRace } from "../../../services/RaceService";

export function AnimalFormUpdate() {
  const [formData, setFormData] = useState<Animal>({
    id: 0,
    nom: "",
    idHabitat: "",
    idRace: "",
    nomRace: "",
  });
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal]= useState<number>(
    null
  );
  const [resetImage, setResetImage] = useState(false);
  const [races, setRaces] = useState([]);
  const [habitat, setHabitat] = useState<Habitat[]>([]);
  const [showRaceInput, setShowRaceInput] = useState(false);
  const formRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("/api/habitat/")
      .then((response) => response.json())
      .then((data) => setHabitat(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des habitats", error)
      );

    fetchRaces().then((data) => setRaces(data));
  }, []);

  useEffect(() => {
    fetch("/api/animal/")
      .then((response) => {
    return response.json();
  })
      .then((data) => {
        setAnimals(data); // Remplir la liste des animaux
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des animaux", error)
      );
  }, []);
  
  useEffect(() => {
    if (selectedAnimal !== null) {
      fetch(`/api/animal/${selectedAnimal}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Données de l'animal :", data);
          const animalData = data[0];
          setFormData({
            id: animalData.id || 0,
            nom: animalData.nom || "",
            idHabitat: (animalData.habitat && animalData.habitat.id) || "", 
            idRace: (animalData.race && animalData.race.id) || "",
            nomRace: (animalData.race && animalData.race.nom) || "",     
          });
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des détails de l'animal:", error);
        });
    }
  }, [selectedAnimal]);
  
  const handleRaceChange = (e) => {
    const { name, value } = e.target;
    if (name === "idRace") {
      setFormData({
        ...formData,
        idRace: value,
        nomRace: "",
      });
    }
    if (name === "nomRace") {
      setFormData({
        ...formData,
        nomRace: value,
        idRace: "",
      });
    }
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
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animalId = Number(e.target.value);
    console.log("Animal sélectionné avec l'ID :", animalId);
    setSelectedAnimal(animalId);
  };
  const handleEditRace = async (raceId) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir modifier le nom de la race ? Cela mettra à jour tous les animaux associés."
    );
    if (confirmation && formData.nomRace) {
      try {
        const updatedRace = await updateRace(raceId, { nom: formData.nomRace });
        console.log("Race mise à jour avec succès :", updatedRace);
        setSuccessMessage("Race modifiée avec succès !");
      } catch (error) {
        console.error("Erreur lors de la modification de la race :", error);
        setError("Erreur lors de la modification de la race.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formAnimal = new FormData();
    formAnimal.append("nom", formData.nom);
    formAnimal.append("idHabitat", formData.idHabitat);

    try {
      if (formData.nomRace) {
        formAnimal.append("nomRace", formData.nomRace);
    } else if (formData.idRace) {
        // Sinon utiliser idRace si sélectionné
        formAnimal.append("idRace", formData.idRace);
    } else {
        setError("Vous devez sélectionner ou créer une race.");
        return;
    }
   
    if (file) {
      const originalFilename = file.name.split(".").slice(0, -1).join(".");
      const extension = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
      const imageSubDirectory = `/animals`;
      formAnimal.append("file", file);
      formAnimal.append("nomImage", imageNameGenerated);
      formAnimal.append("image_sub_directory", imageSubDirectory);
    }
    formAnimal.forEach((value, key) => {
      console.log(`${key}: ${value}`);
  });

  const response = await fetch(`/api/animal/update/${formData.id}`, {
      method: "POST",
      body: formAnimal,
  });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  setSuccessMessage("Animal mis à jour avec succès !");
  setError(null);
  setResetImage(true);

  setFormData({
      id: 0,
      nom: "",
      idHabitat: "",
      idRace: "",
      nomRace: "",
  });
  setFile(null);

  setTimeout(() => {
      setSuccessMessage(null);
      setResetImage(false);
  }, 5000);

} catch (error) {
  console.error("Erreur lors de la mise à jour de l'animal:", error);
  setError("Erreur lors de la mise à jour de l'animal.");
}

formRef.current.reset();
};


  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <h3>Modifier un Animal</h3>

<select onChange={handleSelectChange} defaultValue="">
  <option value="" disabled>
    Sélectionner un animal
  </option>
  {animals.map((animal: any) => (
    <option key={animal.id} value={animal.id}>
      {animal.nom}
    </option>
  ))}
</select>
        <TextInputField
        name="nom"
        label="Nom de l'animal"
        value={formData.nom}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="habitat">Habitat :</label>
        <select
          id="habitat"
          name="idHabitat"
          value={formData.idHabitat}
          onChange={handleChange}
        >
          <option value="" disabled>Choisir un habitat</option>
          {habitat.map((habitat) => (
            <option key={habitat.id} value={habitat.id}>
              {habitat.nom}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="race">Race :</label>
        <select
          name="idRace"
          value={formData.idRace}
          onChange={handleChange}
        >
          <option value="">Choisir une race</option>
          {races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.nom}
            </option>
          ))}
        </select>

        <button
    type="button"
    onClick={() => {
        const confirmation = window.confirm(
            "Êtes-vous sûr de vouloir modifier le nom de la race ? Cela mettra à jour tous les animaux associés à cette race."
        );
        if (confirmation) {
            setShowRaceInput(!showRaceInput);
        }
    }}
>
    {showRaceInput ? "Annuler la modification de la race" : "Modifier une race"}
</button>

        {showRaceInput && (
          <div>
            <TextInputField
              name="nomRace"
              label="Nom de la nouvelle race"
              value={formData.nomRace}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <ImageForm
        serviceName={formData.nom}
        onImageSelect={setFile}
        resetImage={resetImage}
      />

      <button type="submit">Mettre à jour l'animal</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
