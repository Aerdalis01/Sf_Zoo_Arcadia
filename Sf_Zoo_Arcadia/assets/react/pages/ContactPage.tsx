import React, { useState, useEffect } from 'react';
import { ContactForm } from '../controllers/components/form/Contact/ContactForm';

interface Horaire {
  id: number;
  jour: string;
  heureOuverture: string;
  heureFermeture: string;
}



export const ContactPage: React.FC = () => {
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    // Appel de l'API pour récupérer les horaires
    const fetchHoraires = async () => {
      try {
        const response = await fetch('/api/horaire');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des horaires');
        }
        const data = await response.json();
        console.log(data);
        setHoraires(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchHoraires();
  }, []);
  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  // Fonction pour gérer le succès de l'envoi du formulaire
  const onFormSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowForm(false);
  };
  return (
    <>
      <section className="contact">
        <div className="contact-titre col-10 text-center d-flex flex-column align-items-center w-100 pt-3">
          <h1>Contact</h1>
          <h3>Pour laisser un message à notre équipe ou donnez votre avis c'est par ici.</h3>
        <ContactForm handleFormToggle={handleFormToggle} onFormSuccess={onFormSuccess} />
        </div>
        <div className="container-fluid text-center">
          <h2 className="py-2">Informations</h2>
          <div className="row row-cols-1 row-cols-md-2">
            <div className="col">
              <div className="card mb-3">
                <div className="d-flex justify-content-around w-100" >
                </div>
                <div className="row w-100 text-center d-flex  justify-content-center g-0">
                  <div className="col d-flex justify-content-center p-md-3 p-lg-4 p-xl-5">
                    <div
                      className="train--card-body col-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center">
                      <h4>Horaires du zoo</h4>
                      <ul>
                        {horaires.length > 0 ? (
                          horaires.map((horaire) => (
                            <li key={horaire.id}>
                              {horaire.jour} : {new Date(horaire.heureOuverture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(horaire.heureFermeture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </li>
                          ))
                        ) : (
                          <p>Aucun horaire disponible.</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card mb-3"><div className="d-flex justify-content-around w-100" >
              </div>
                <div className="row w-100 text-center d-flex  justify-content-center g-0">
                  <div className="col d-flex justify-content-center p-md-3 p-lg-4 p-xl-5">
                    <div
                      className="train--card-body col-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center">
                      <h4>Accès au zoo</h4>
                      <p className="card-text">
                        En voiture:
                        -A 44 minutes de Rennes via la N24

                        En  bus:
                        -A 1h via la ligne 1a de la gare routière de Rennes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card mb-3">
                <div className="row w-100 text-center d-flex  justify-content-center g-0">
                  <div className="col d-flex justify-content-center p-md-3 p-lg-4 p-xl-5">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};