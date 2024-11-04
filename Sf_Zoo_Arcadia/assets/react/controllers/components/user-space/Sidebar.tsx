import React from "react";
import { Link } from "react-router-dom";
import { getUserRoles } from "../../../pages/Auth/LoginPage";


interface SidebarProps {
  onSectionChange: (section: string) => void;  
}

export const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  const userRoles = getUserRoles();
  return (
    <div className="sidebar bg-primary p-3 text-center">
      <h3 className="text-warning" >Tableau de Bord</h3>
      <ul className="nav flex-column">
        
        {userRoles.includes("ROLE_ADMIN") && (
          <>
            <hr />
            <div className="accordion" id="accordionAdmin">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Espace Admin
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionAdmin"
                >
                  <div className="accordion-body">
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("service")}>
                        Services
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("habitat")}>
                        Habitats
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("animal")}>
                        Animaux
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("horaire")}>
                        Horaires
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("reporting")}>
                        Reporting
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("adminReport")}>
                        Compte Rendu vétérinaire
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <hr />

        {(userRoles.includes("ROLE_VETERINAIRE") ||
          userRoles.includes("ROLE_ADMIN")) && (
          <>
            <div className="accordion" id="accordionVeterinaire">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Espace Vétérinaire
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionVeterinaire"
                >
                  <div className="accordion-body">
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("rapport")}>
                        Rapports Vétérinaires
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#" onClick={() => onSectionChange("comment")}>
                        Commentaires Habitats
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <hr />

        {(userRoles.includes("ROLE_EMPLOYE") ||
          userRoles.includes("ROLE_ADMIN")) && (
          <>
            <div className="accordion" id="accordionEmploye">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Espace Employé
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionEmploye"
                >
                  <div className="accordion-body">
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("avis")}>
                        Avis
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("alimentation")}>
                        Alimentation
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("contact")}>
                        Contacts
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("serviceUpdate")}>
                        Services (Mise à jour)
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={() => onSectionChange("horaireUpdate")}>
                        Horaires (Mise à jour)
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </ul>
    </div>
  );
};
