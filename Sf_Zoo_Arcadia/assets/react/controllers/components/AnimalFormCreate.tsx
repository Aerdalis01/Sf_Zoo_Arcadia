import React, { useState, useRef, useEffect } from "react";
import { Animal } from "../../models/animalInterface";
import { Habitat } from "../../models/habitatInterface";
import { TextInputField } from "./form/TextInputField";
import {RaceForm} from './RaceForm'
import { fetchRaces, createRace, updateRace, deleteRace } from '../../services/RaceService'; 

export function AnimalForm() {
  const[formData, setFormData] = useState<Animal>({
    id: 0,
    nom: "",
    idHabitat: "",
    idRace: "",
  });
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [showRaceForm, setShowRaceForm] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [habitat, setHabitat] = useState<Habitat[]>([]);
  const formRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les races via le service
    fetchRaces().then((data) => setRaces(data));
  }, []);

  const handleRaceSubmit = (raceData) => {
    if (editingRace) {
      // Modifier une race existante
      updateRace(editingRace.id, raceData).then((updatedRace) => {
        const updatedRaces = races.map((race) =>
          race.id === updatedRace.id ? updatedRace : race
        );
        setRaces(updatedRaces);
        setEditingRace(null); // Arrêter la modification
      });
    } else {
      // Créer une nouvelle race
      createRace(raceData).then((newRace) => {
        setRaces([...races, newRace]);
      });
    }
    setShowRaceForm(false);
  };

  const handleDeleteRace = (raceId) => {
    deleteRace(raceId).then(() => {
      setRaces(races.filter((race) => race.id !== raceId));
      if (selectedRace === raceId) {
        setSelectedRace('');
      }
    });
  };

  const handleEditRace = (race) => {
    setEditingRace(race); 
    setShowRaceForm(true);
  };

  useEffect(() => {
    fetch("/api/habitat")
      .then((response) =>{
        console.log("Réponse brute de l'API :", response);
        return response.json();
      })
      .then((data) => {
        console.log("Données des services :", data); 
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
    const formAnimal = new FormData();
    formAnimal.append("nom", formData.nom)
    formAnimal.append("idHabitat", formData.idHabitat)
    formAnimal.append("idRace", formData.idRace);
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

      formAnimal.append("file", file);
      formAnimal.append("nomImage", imageNameGenerated);
      formAnimal.append("image_sub_directory", imageSubDirectory);
      console.log("Nom de l'image généré :", imageNameGenerated);
    }
    formAnimal.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    fetch("/api/animal/new", {
      method: "POST",
      body: formAnimal,
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
            idHabitat: "",
            idRace: "",
          });
          setFile(null);
          setError(null);

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
      <div>
        <label htmlFor="habitat">Habitat :</label>
        <select
          id="habitat"
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
        <select
          id="race"
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

        <button type="button" onClick={() => setShowRaceForm(true)}>
          Ajouter une nouvelle race
        </button>

        {selectedRace && (
          <>
            <button
              type="button"
              onClick={() => handleEditRace(races.find((r) => r.id === selectedRace))}
            >
              Modifier
            </button>
            <button type="button" onClick={() => handleDeleteRace(selectedRace)}>
              Supprimer
            </button>
          </>
        )}
      </div>

      {showRaceForm && (
        <RaceForm
          onSubmit={handleRaceSubmit}
          initialRace={editingRace}
        />
      )}

      <button type="submit">Enregistrer l'animal</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
