import React, { useState, useEffect, useRef } from "react";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "../form/TextInputField";
import { HoraireField } from "./HoraireField";
import { CheckBoxField } from "../form/CheckBoxFieldProps";
import { ServiceFormFields } from "../form/ServiceFormFieldsProps";

export function ServiceFormUpdate() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [serviceFormFieldsData, setServiceFormFieldsData] = useState({
    description: "",
    titre: "",
    horaireTexte: "",
    carteZoo: false,
  });
  const [serviceData, setServiceData] = useState({
    id: 0,
    nom: "",
    titre: "",
    description: "",
    horaireTexte: "",
    carteZoo: false,
  });
  const [removeSousService, setRemoveSousService] = useState<boolean | null>(
    null
  );
  const [resetImage, setResetImage] = useState(false);
  const formRef = useRef(null);
  const [isCarteZoo, setIsCarteZoo] = useState(false);
  const [removeImage, setRemoveImage] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [horaireTexte, setHoraireTexte] = useState("");

  useEffect(() => {
    fetch("/api/service")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des services :", error);
      });
  }, []);

  useEffect(() => {
    if (selectedServiceId !== null) {
      fetch(`/api/service/${selectedServiceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des services");
          }
          return response.json();
        })
        .then((data) => {

          setServiceData({
            id: data.id || 0,
            nom: data.nom || "",
            titre: data.titre || "",
            description: data.description || "",
            horaireTexte: data.horaiteTexte || "",
            carteZoo: data.carteZoo || false,
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des données du service:",
            error
          );
        });
    }
  }, [selectedServiceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCarteZoo(e.target.checked); // Mettre à jour l'état pour la carte du zoo
    setServiceData({
      ...serviceData,
      carteZoo: e.target.checked ? true : false,
    }); // Enregistrer la valeur booléenne dans formData
  };
  //Gestion du changement du select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedServiceId(selectedId);
  };

  // Gestion des changements pour les champs de service
  const handleServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (!serviceData.nom) {
      setError("Les champs Nom et Type sont obligatoires.");
      return;
    }
    const formService = new FormData();

    formService.append("nom", serviceData.nom);

    if (horaireTexte) {
      formService.append("horaire", serviceData.horaireTexte);
    }

    if (serviceData.carteZoo !== null && serviceData.carteZoo !== undefined) {
      formService.append("carteZoo", serviceData.carteZoo ? "true" : "false");
    }

    if (serviceData.description !== "") {
      formService.append("description", serviceData.description);
    }
    if (serviceData.titre !== "") {
      formService.append("titre", serviceData.titre);
    }
    if (removeImage) {
      formService.append("removeImage", "true");
    }
    if (removeSousService) {
      formService.append("removeSousServices", "true");
    }

    if (file) {
      const originalFilename = file.name.split(".").slice(0, -1).join(".");
      const extension = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
      const imageSubDirectory = `/services`;

      formService.append("file", file);
      formService.append("nomImage", imageNameGenerated);
      formService.append(
        "image_sub_directory",
        imageSubDirectory
      );
    }

    fetch(`/api/service/update/${selectedServiceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formService,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Réponse brute du serveur :", text);
            throw new Error("Erreur lors de la mise à jour du service");
          });
        }
        return response.json();
      })
      .then((data) => {
  
        setSuccessMessage("Sous-service mis à jour avec succès !");
        setError(null);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setError("Erreur lors de la mise à jour du sous-service.");
        setSuccessMessage(null);
        formRef.current?.reset();
        setFile(null); 
      });

  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <h3>Modifier un Service</h3>

      {/* Sélectionner un service */}
      <select onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>
          Sélectionner un service
        </option>
        {services.map((service: any) => (
          <option key={service.id} value={service.id}>
            {service.nom}
          </option>
        ))}
      </select>
      <ServiceFormFields
        serviceFormFieldsData={serviceData}
        setServiceFormFieldsData={setServiceFormFieldsData}
      />
      <hr />
      <TextInputField
        name="nom"
        label="Nom du service"
        value={serviceData.nom}
        onChange={handleServiceChange}
      />
      <TextInputField
        name="titre"
        label="Titre du service"
        value={serviceData.titre}
        onChange={handleServiceChange}
      />
      <TextInputField
        name="description"
        label="Description"
        value={serviceData.description}
        onChange={handleServiceChange}
      />

<label>Horaires</label>
      <textarea
        name="horaireTexte" // Correspondance exacte avec la clé dans serviceData
        placeholder="Ex: Lundi: 09h00 - 18h00"
        value={serviceData.horaireTexte || ""} // Valeur par défaut si undefined
        onChange={handleChange} // Gestionnaire pour rendre modifiable
      />
      
      <CheckBoxField label="Si carte zoo, le fichier doit se nommer: " checked={serviceData.carteZoo} onChange={(e) => setServiceData({ ...serviceData, carteZoo: e.target.checked })} />

      <ImageForm serviceName={serviceData.nom} onImageSelect={setFile} resetImage={resetImage} />
      <div>
        <label>Supprimer l'image existante :</label>
        <input
          type="checkbox"
          onChange={(e) => setRemoveImage(e.target.checked)} // Utilise un state pour traquer cette option
        />
      </div>
      <div>
        <label>Supprimer les sous services existants :</label>
        <input
          type="checkbox"
          onChange={(e) => setRemoveSousService(e.target.checked)} // Utilise un state pour traquer cette option
        />
      </div>
      <button type="submit">Mettre à jour</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
