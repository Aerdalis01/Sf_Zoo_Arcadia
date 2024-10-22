import React, { useState, useEffect, useRef } from "react";
import { ImageForm } from "./ImageForm";
import { TextInputField } from "../form/TextInputField";
import { HoraireField } from "../form/HoraireField";
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
    horaire: "",
    carteZoo: false,
  });
  const [serviceData, setServiceData] = useState({
    id: 0,
    nom: "",
    titre: "",
    description: "",
    horaire: "",
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

  const modifierHoraire1 = () => {
    if (horaireInput1 && horaireNom1) {
      setHoraires1((prevHoraires) => [
        ...prevHoraires,
        { nom: horaireNom1, heure: horaireInput1 },
      ]);
      setHoraireInput1("");
    }
  };
  const modifierHoraire2 = () => {
    if (horaireInput2 && horaireNom2) {
      setHoraires2((prevHoraires) => [
        ...prevHoraires,
        { nom: horaireNom2, heure: horaireInput2 },
      ]);
      setHoraireInput2("");
    }
  };

  useEffect(() => {
    fetch("/api/service")
      .then((response) => response.json())
      .then((data) => {
        console.log("Services récupérés :", data);
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
          console.log("Réponse brute:", response);
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des services");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Services récupérés :", data);

          setServiceData({
            id: data.id || 0,
            nom: data.nom || "",
            titre: data.titre || "",
            description: data.description || "",
            horaire: JSON.stringify(data.horaire, null, 2) || "",
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
    console.log("Service sélectionné avec l'ID :", selectedId);
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
    if (!serviceData.nom) {
      setError("Les champs Nom et Type sont obligatoires.");
      return;
    }
    const formService = new FormData();
    console.log("Service Data:", serviceData);
    formService.append("nom", serviceData.nom);

    if (horaires1.length === 0 && horaires2.length === 0) {
      formService.append("horaire", ""); // Envoyer un champ vide si les horaires sont vides
    } else {
      const horaires = {
        horaire1: horaires1.length > 0 ? horaires1 : null,
        horaire2: horaires2.length > 0 ? horaires2 : null,
      };
      formService.append("horaire", JSON.stringify(horaires));
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
      
      const imagePathGenerated = `/${serviceData.nom.toLowerCase()}`;
      const imageSubDirectory = `/services`;

      formService.append("file", file);
      formService.append("nomImage", imageNameGenerated);
      formService.append(
        "image_sub_directory",
        imageSubDirectory
      );
    }

    console.log(
      "Données envoyées :",
      Array.from((formService as any).entries())
    );

    fetch(`/api/service/${selectedServiceId}`, {
      method: "POST",
      body: formService,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Réponse brute du serveur (HTML) :", text); // Affichez le texte brut
            throw new Error("Erreur lors de la mise à jour du service");
          });
        }
        return response.json();
      })
      .then((data) => {
    console.log("Données renvoyées par le serveur:", data);
    setSuccessMessage("Sous-service mis à jour avec succès !");
    setError(null);
  })
  .catch((error) => {
    console.error("Erreur:", error);
    setError("Erreur lors de la mise à jour du sous-service.");
    setSuccessMessage(null);
  });
  formRef.current.reset();
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

      <HoraireField
        horaireNom={horaireNom1}
        horaireInput={horaireInput1}
        setHoraireNom={setHoraireNom1}
        setHoraireInput={setHoraireInput1}
        horaires={horaires1}
        ajouterHoraire={modifierHoraire1}
        label="Ajouter Horaire 1"
      />

      <HoraireField
        horaireNom={horaireNom2}
        horaireInput={horaireInput2}
        setHoraireNom={setHoraireNom2}
        setHoraireInput={setHoraireInput2}
        horaires={horaires2}
        ajouterHoraire={modifierHoraire2}
        label="Ajouter Horaire 2"
      />

      <CheckBoxField
        label="Si le service modifié contient une carte zoo cliqué"
        checked={isCarteZoo}
        onChange={handleCheckboxChange}
      />

      <ImageForm serviceName={serviceData.nom} onImageSelect={setFile} resetImage={resetImage}/>
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
