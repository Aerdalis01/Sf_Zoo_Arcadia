import React, { useState, useEffect } from "react";
import { Horaire } from "../models/horaireInterface";
import { ContactForm } from "../controllers/components/form/Contact/ContactForm";
export const InfoPage = () => {
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const handleFormToggle = () => {

    console.log("Form toggled");
  };

  const onFormSuccess = () => {
    console.log("Form submitted successfully");
  };

  
  useEffect(() => {
    const fetchHoraires = async () => {
      try {
        const response = await fetch("/api/horaire", {
          method: "GET",
        });
        console.log("bonjour", response);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des horaires");
        }

        const data = await response.json();
        console.log("Salut", data);
        setHoraires(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires", error);
      }
    };

    fetchHoraires();
  }, []);

  return (
    <section className="contact">
      <div className="row w-100 text-center d-flex justify-content-center g-0">
        <div className="col d-flex justify-content-center p-md-3 p-lg-4 p-xl-5">
          <div className="train--card-body col-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center">
            <h2>Horaires du Zoo :</h2>
            <ul className="card-text">
              {horaires.map((horaire, index) => (
                <li className="card-text" key={index}>
                  {horaire.jour} :{" "}
                  {new Date(horaire.heureOuverture).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}{" "}
                  -
                  {new Date(horaire.heureFermeture).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <div className="row w-100 text-center d-flex justify-content-center g-0">
        <div className="col d-flex justify-content-center p-md-3 p-lg-4 p-xl-5">
          <div className="train--card-body col-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center">
            <h4>Accès au zoo</h4>
            <p className="card-text">
              En voiture: -A 44 minutes de Rennes via la N24
              <br />
              En bus: -A 1h via la ligne 1a de la gare routière de Rennes.
            </p>
          </div>
        </div>
      </div>
      <div>
        <ContactForm
          handleFormToggle={handleFormToggle}
          onFormSuccess={onFormSuccess}
        />
        ;
      </div>
    </section>
  );
};
