import React, { useState, useEffect } from "react";
import { SousService } from "../../models/sousServiceInterface";
import { ImageForm } from "./ImageForm";
import { Service } from "../../models/serviceInterface";
import { TextInputField } from "./form/TextInputField";
import { CheckBoxField } from "./form/CheckBoxFieldProps";


export function SousServiceForm() {
  const [formData, setFormData] = useState<SousService>({
    id: 0,
    nom: "",
    description: "",
    menu: false,
    idService: "",
  });

  const [isMenu, setIsMenu] = useState(false);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [service, setServices] = useState<Service[]>([]);
  

  useEffect(() => {
    fetch("/api/service")
      .then((response) => {
        console.log("Réponse brute de l'API :", response); // Ajoutez cette ligne pour voir la réponse brute
        return response.json();
      })
      .then((data) => {
        console.log("Données des services :", data); // Vérifiez ce qui est récupéré
        setServices(data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des services", error)
      );
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenu(e.target.checked);
    setFormData({ ...formData, menu: e.target.checked ? true : false });
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
    const formSousService = new FormData();
    formSousService.append("nom", formData.nom);
    formSousService.append("description", formData.description);
    formSousService.append("menu", formData.menu ? "1" : "0");
    formSousService.append("idService", formData.idService);

    const appendImage =(file: File | null, fieldName: string) => {
    
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

      formSousService.append(fieldName, file);
      formSousService.append(`${fieldName}_name`, imageNameGenerated);
      formSousService.append(`${fieldName}_sub_directory`, imageSubDirectory);
      console.log(`Nom de l'image généré pour ${fieldName}:`, imageNameGenerated);
    }
  };
    appendImage(file1, "file1");
    appendImage(file2, "file2");

    console.log(
      "FormData envoyé :",
      Object.fromEntries((formSousService as any).entries())
    );

    fetch("/api/sousService/new", {
      method: "POST",
      body: formSousService,
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        setSuccessMessage("Sous-Service ajouté avec succès !");

        setFormData({
          id: 0,
          nom: "",
          description: "",
          menu: false,
          idService: "",
        });
        setFile1(null);
        setFile2(null);
        setError(null);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.error("Erreur lors de la soumission du formulaire:", error);
        setError("Erreur lors de l'ajout du service.");
        setSuccessMessage(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Service :</label>
        <select
          name="idService"
          value={formData.idService}
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
      <TextInputField
        name="nom"
        label="Nom du sous service"
        value={formData.nom}
        onChange={handleChange}
      />
      <TextInputField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <hr />
      <CheckBoxField
        label="Pour intégrer le menu cocher cette case et sélectionnez une image"
        checked={isMenu}
        onChange={handleCheckboxChange}
      />
      <div>
      <ImageForm serviceName={formData.nom} onImageSelect={setFile1} />
      </div>
      <hr />
      <div>
      <ImageForm serviceName={formData.nom} onImageSelect={setFile2} />
      </div>
      <button type="submit">Soumettre</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}
