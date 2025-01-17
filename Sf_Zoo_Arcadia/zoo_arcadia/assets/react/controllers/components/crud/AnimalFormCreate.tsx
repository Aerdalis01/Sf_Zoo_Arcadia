import React, { useState, useRef, useEffect } from "react";
import { Animal } from "../../../models/animalInterface";
import { Habitat } from "../../../models/habitatInterface";
import { TextInputField } from "../form/TextInputField";
import { ImageForm } from "./ImageForm";
import { fetchRaces, createRace, updateRace, deleteRace } from '../../../services/RaceService';

export function AnimalForm() {
  const [formData, setFormData] = useState<Animal>({
    id: 0,
    nom: "",
    idHabitat: "",
    idRace: "",
    nomRace: ""
  });
  const [resetImage, setResetImage] = useState(false);
  const [races, setRaces] = useState([]);
  const [habitat, setHabitat] = useState<Habitat[]>([]);
  const [showRaceInput, setShowRaceInput] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const formRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {

    fetchRaces().then((data) => setRaces(data));
  }, []);

  const handleRaceSubmit = (race) => {

    setRaces([...races, race]);
    setShowRaceInput(false);
  };

  const handleEditRace = (race) => {
    setEditingRace(race);
    setShowRaceInput(true);
  };

  useEffect(() => {
    fetch("/api/habitat/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHabitat(data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des services", error)
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
    const formAnimal = new FormData();
    formAnimal.append("nom", formData.nom)
    formAnimal.append("idHabitat", formData.idHabitat)

    if (formData.idRace) {
      formAnimal.append("idRace", formData.idRace);
    } else if (formData.nomRace && showRaceInput) {
      formAnimal.append("nomRace", formData.nomRace);
    } else {
      setError("Vous devez sélectionner une race ou en créer une.");
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
    });
    fetch("/api/animal/new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formAnimal,
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            setError("Vous n'avez pas l'autorisation requise pour cette action.");
            return Promise.reject("Unauthorized");
          } else {
            return Promise.reject(`Erreur HTTP ${response.status}`);
          }
        }
        const contentType = response.headers.get("content-type");

        return contentType && contentType.includes("application/json")
          ? response.json()
          : Promise.reject("Réponse non JSON reçue.");
      })
      .then((data) => {
        if (data && data.status === "success") {
          setSuccessMessage("Animal ajouté avec succès !");
          setFormData({
            id: 0,
            nom: "",
            idHabitat: "",
            idRace: "",
            nomRace: "",
          });
          setFile(null);
          setError(null);
          setResetImage(true);
          setTimeout(() => {
            setSuccessMessage(null);
            setResetImage(false);
          }, 5000);
        } else {
          throw new Error("Erreur : Réponse inattendue.");
        }
      })

      .catch((error) => {
        if (error === "Unauthorized") return;
        setError("Erreur lors de l'ajout de l'animal");
        setSuccessMessage(null);
      });
    formRef.current.reset();
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger">{error}</p>}
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
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
          <option value="">Choisir un habitat</option>
          {habitat.map((habitat) => (
            <option key={habitat.id} value={habitat.id}>
              {habitat.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="race">Race :</label>
        {!showRaceInput ? (
          <>
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
            <button type="button" onClick={() => setShowRaceInput(true)}>
              Créer une nouvelle race
            </button>
          </>
        ) : (
          <>
            <TextInputField
              name="nomRace"
              label="Nom de la nouvelle race"
              value={formData.nomRace}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowRaceInput(false)}>
              Choisir une race existante
            </button>
          </>
        )}
      </div>

      <ImageForm serviceName={formData.nom} onImageSelect={setFile} resetImage={resetImage} />

      <button type="submit">Enregistrer l'animal</button>
    </form>
  );
}
