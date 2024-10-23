import React, { useState } from "react";
import { ServiceForm } from "../crud/ServiceForm";
import { ServiceFormUpdate } from "../crud/ServiceFormUpdate";
import { ServiceDeleteForm } from "../crud/ServiceDeleteForm";
import { HabitatForm } from "../crud/HabitatFormCreate";
import { HabitatFormUpdate } from "../crud/HabitatFormUpdate";
import { HabitatDeleteForm } from "../crud/HabitatDeleteForm";
import { AnimalForm } from "../crud/AnimalFormCreate";
import { AnimalFormUpdate } from "../crud/AnimalFormUpdate";
import { AnimalDeleteForm } from "../crud/AnimalDeleteForm";

export const Content: React.FC<{ section: string }> = ({ section }) => {
  const [crudAction, setCrudAction] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCrudAction(event.target.value);
  };
  
  const renderForm = () => {
    switch (section) {
      case "service":
        switch (crudAction) {
          case "create":
            return <ServiceForm />;
          case "edit":
            return <ServiceFormUpdate />;
          case "delete":
            return <ServiceDeleteForm />;
          default:
            return <p>Veuillez sélectionner une action pour les services</p>;
        }
      case "habitat":
        switch (crudAction) {
          case "create":
            return <HabitatForm />;
          case "edit":
            return <HabitatFormUpdate />;
          case "delete":
            return <HabitatDeleteForm />;
          default:
            return <p>Veuillez sélectionner une action pour les habitats</p>;
        }
      case "animal":
        switch (crudAction) {
          case "create":
            return <AnimalForm />;
          case "edit":
            return <AnimalFormUpdate />;
          case "delete":
            return <AnimalDeleteForm />;
          default:
            return <p>Veuillez sélectionner une action pour les animaux</p>;
        }
      default:
        return <p>Section non trouvée</p>;
    }
  };

  return (
    <div className="content p-3">
      {(section === "service" || section === "habitat" || section === "animal") && (
        <>
        console.log(section);
          <h2>Gestion de {section === "service" ? "Services" : section === "habitat" ? "Habitats" : "Animaux"}</h2>
          <div className="mb-3">
            <label htmlFor="crudSelect" className="form-label">
              Sélectionnez une action :
            </label>
            <select
              id="crudSelect"
              className="form-select"
              value={crudAction}
              onChange={handleSelectChange}
            >
              <option value="">Choisissez une action</option>
              <option value="create">Créer un {section}</option>
              <option value="edit">Modifier un {section}</option>
              <option value="delete">Supprimer un {section}</option>
            </select>
          </div>
          <div className="mt-3">{renderForm()}</div>
        </>
      )}
    </div>
  );
};