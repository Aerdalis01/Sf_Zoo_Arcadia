import React, { useState, useEffect, useRef } from "react";
import { ImageForm } from "./ImageForm";
import { CheckBoxField } from "../form/CheckBoxFieldProps";
import { TextInputField } from "../form/TextInputField";
import { Service } from "../../../models/serviceInterface";

export function SousServiceFormUpdate() {
  const [sousServices, setSousServices] = useState([]);
  const [selectedSousServiceId, setSelectedSousServiceId] = useState<
    number | null
  >(null);
  const [sousServiceData, setSousServiceData] = useState({
    id: 0,
    nom: "",
    description: "",
    menu: false,
    idService: "",
  });
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [resetImage, setResetImage] = useState(false);
  const formRef = useRef(null);
  const [isMenu, setIsMenu] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [service, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/sousService")
      .then((response) => response.json())
      .then((data) => {
        setSousServices(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des services :", error);
      });
  }, []);
  useEffect(() => {
    fetch("/api/service")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setServices(data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des services", error)
      );
  }, []);
  useEffect(() => {
    if (selectedSousServiceId !== null) {
      fetch(`/api/sousService/${selectedSousServiceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des sous services");
          }
          return response.json();
        })
        .then((data) => {

          setSousServiceData({
            id: data.id || 0,
            nom: data.nom || "",
            description: data.description || "",
            menu: data.menu || false,
            idService: data.idService || "",
          });
          setIsMenu(data.menu || false);
          setResetImage(true);
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des données du service:",
            error
          );
        });
    }
  }, [selectedSousServiceId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSousServiceData({
      ...sousServiceData,
      [name]: value,
    });
  };
  //Gestion du changement du select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSousServiceId(selectedId);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenu(e.target.checked);
    setSousServiceData({
      ...sousServiceData,
      menu: e.target.checked ? true : false,
    });
  };
  // Gestion des changements pour les champs de service
  const handleSousServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSousServiceData({
      ...sousServiceData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formSousService = new FormData();
    formSousService.append("nom", sousServiceData.nom);
    formSousService.append("description", sousServiceData.description);
    formSousService.append("idService", sousServiceData.idService);

    const appendImage = (file: File | null, fieldName: string) => {
      if (file) {
        const originalFilename = file.name.split(".").slice(0, -1).join(".");
        const extension = file.name.split(".").pop();
        const timestamp = new Date().getTime();
        const imageNameGenerated = `${originalFilename}-${timestamp}.${extension}`;
        const imageSubDirectory = `/services`;

        formSousService.append(fieldName, file);
        formSousService.append(`${fieldName}_name`, imageNameGenerated);
        formSousService.append(`${fieldName}_sub_directory`, imageSubDirectory);
      }
    };
    appendImage(file1, "image1");
    appendImage(file2, "image2");

    fetch(`/api/sousService/${selectedSousServiceId}`, {
      method: "POST",
      body: formSousService,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du sous-service");
        }
        return response.json();
      })
      .then(() => {
        setSuccessMessage("Sous-service mis à jour avec succès !");
        setError(null);
        setFile(null);
        setResetImage(true);

        setTimeout(() => setResetImage(false), 500);
      })
      .catch((error) => {
        setError("Erreur lors de la mise à jour du sous-service.");
        setSuccessMessage(null);
      });
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <h3>Modifier un Sous Service</h3>

      <select onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>
          Sélectionner un sous service
        </option>
        {sousServices.map((sousService: any, index: number) => (
          <option key={index} value={sousService.id}>
            {sousService.nom}
          </option>
        ))}
      </select>
      <TextInputField
        name="nom"
        label="Nom du sous-service"
        value={sousServiceData.nom}
        onChange={handleSousServiceChange}
      />
      <TextInputField
        name="description"
        label="Description"
        value={sousServiceData.description}
        onChange={handleSousServiceChange}
      />
      <hr />
      <div>
        <ImageForm
          serviceName= "Image Principal"
          onImageSelect={setFile1}
          resetImage={resetImage}
        />
      </div>
      <hr />
      <CheckBoxField
        label="Si le service modifié contient une carte zoo cliqué"
        checked={isMenu}
        onChange={handleCheckboxChange}
      />
      {isMenu && (
      <div>
        <ImageForm
          serviceName={sousServiceData.nom}
          onImageSelect={setFile2}
          resetImage={resetImage}
        />
      </div>
      )}
      <div>
        <hr />
        <label>Service :</label>
        <select
          name="idService"
          value={sousServiceData.idService}
          onChange={handleChange}
        >
          <option value="">Sélectionner un service</option>
          {service.map((service, index) => (
            <option key={service.id || index} value={service.id}>
              {service.nom}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Mettre à jour</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
