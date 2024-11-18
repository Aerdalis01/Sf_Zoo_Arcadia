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
import { AvisApproval } from "../form/Avis/AvisApproval";
import { AlimentationForm } from "../form/Alimentation/AlimentationForm";
import { AlimentationReport } from "../form/Alimentation/AlimentationReportForm";
import { AdminReports } from "../form/Alimentation/AdminReportsForm";
import { HoraireForm } from "../form/Contact/HoraireForm";
import {HoraireFormUpdate} from "../crud/HoraireFormUpdate";
import { HoraireFormDelete } from "../crud/HoraireFormDelete";
import { ContactResponseForm } from "../form/Contact/ContactResponseForm";
import { RegisterPage } from "../../../pages/Auth/RegisterPage";
import { SousServiceForm } from "../crud/SousServiceForm";
import { SousServiceFormUpdate } from "../crud/SousServiceFormUpdate";
import { SousServiceDeleteForm } from "../crud/SousServiceDeleteForm";
import { Reporting } from "../form/Reporting";
import { Horaire } from "../../../models/horaireInterface";

export const Content: React.FC<{ section: string }> = ({ section }) => {
  const [crudAction, setCrudAction] = useState<string>("");
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [horaireTexte, setHoraireTexte] = useState('');

  const addHoraire = () => {
    const newHoraire = { id: Date.now(), horaireTexte };
    setHoraires([...horaires, newHoraire]);
    setHoraireTexte('');
  };

  const updateHoraire = (id: number, updatedText: string) => {
    setHoraires(horaires.map(h => (h.id === id ? { ...h, horaireTexte: updatedText } : h)));
  };

  const deleteHoraire = (id: number) => {
    setHoraires(horaires.filter(h => h.id !== id));
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCrudAction(event.target.value);
  };

  const shouldShowHeader = !(
    section === "alimentation" ||
    section === "adminReport" ||
    section === "rapport"
  );

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
        case "sousService":
        switch (crudAction) {
          case "create":
            return <SousServiceForm />;
          case "update":
            return <SousServiceFormUpdate />;
          case "delete":
            return <SousServiceDeleteForm />;
          default:
            return <p>Veuillez sélectionner une action pour les sous services</p>;
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
      case "horaire":
        switch (crudAction) {
          case "create":
            return <HoraireForm /> 
          case "edit":
            return <HoraireFormUpdate/>;
          case "delete":
            return <HoraireFormDelete/>;
          default:
            return <p>Veuillez sélectionner une action pour les horaires</p>;
        }
      case "avis":
        return <AvisApproval />;
      case "alimentation":
        return <AlimentationForm />;
      case "rapport":
        return <AlimentationReport />;
      case "adminReport":
        return <AdminReports />;
        case "contact":
          return <ContactResponseForm  />;
        case "serviceUpdate":
          return <ServiceFormUpdate />;
        case "horaireUpdate":
          return <HoraireFormUpdate/>;
        case "register":
          return <RegisterPage/>;
        case "reporting":
          return <Reporting/>;
      default:
        return <p>Bienvenue dans votre espace de travail</p>;
    }
  };

  return (
    <div className="content p-3">
      {section === "service" ||
      section === "sousService" ||
      section === "habitat" ||
      section === "animal" ||
      section === "avis" ||
      section === "alimentation" ||
      section === "rapport" ||
      section === "horaire" ||
      section === "contact" ||
      section === "serviceUpdate" ||
      section === "horaireUpdate" ||
      section === "register" ||
      section === "reporting" ||
      section === "adminReport" ? (
        <>
          {shouldShowHeader && (
            section !== "contact" &&
            section !== "serviceUpdate" &&
            section !== "horaireUpdate" &&
            <h2>
              Gestion des{" "}
              {section === "service"
                ? "Services"
                : section === "sousService"
                ? "Sous service"
                : section === "habitat"
                ? "Habitats"
                : section === "animal"
                ? "Animaux"
                : section === "avis"
                ? "Avis"
                : section === "horaire"
                ? "Horaires"
                : ""}
            </h2>
          )}
          {section !== "avis" &&
            section !== "alimentation" &&
            section != "rapport" &&
            section != "adminReport" && 
            section != "contact" && 
            section != "serviceUpdate" && 
            section != "horaireUpdate" && 
            section != "register" && 
            section != "reporting" && 
           (
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
            )}
          <div className="mt-3">{renderForm()}</div>
        </>
      ) : (
        <h1>Bienvenue dans votre espace de travail</h1>
      )}
    </div>
  );
};
