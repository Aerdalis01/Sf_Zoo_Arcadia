import { useEffect, useState } from 'react';
import { Service } from '../models/serviceInterface'
import { SousService } from '../models/sousServiceInterface'
import { Modal, Button } from 'react-bootstrap';


export const ServicePage = () => {
  const [services, setService] = useState<Service[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuImagePath, setMenuImagePath] = useState('');
  const [showCarteZoo, setShowCarteZoo] = useState(false);
  const [carteZooImagePath, setCarteZooImagePath] = useState('');

  const afficherMenuModal = (imagePath) => {
    setMenuImagePath(imagePath);
    setShowMenuModal(true);
  };
  const afficherCarteZooModal = (imagePath) => {
    // Vérifiez si la modal est déjà affichée pour éviter les doublons
    if (showCarteZoo) {
      closeCarteZooModal();
    } else {
      setCarteZooImagePath(imagePath);
      setShowCarteZoo(true);
    }
  };

  const closeCarteZooModal = () => {
    setShowCarteZoo(false);
    setCarteZooImagePath('');
  };
  const closeMenuModal = () => {
    setShowMenuModal(false);
    setMenuImagePath('');
  };
  useEffect(() => {
    fetch('/api/service')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((service: Service) => {
          if (typeof service.horaire === 'string') {
            try {
              service.horaire = JSON.parse(service.horaire);
            } catch (error) {
              console.error("Erreur de parsing de l'horaire:", error);
            }
          }
          console.log(`Sous-services pour ${service.nom}:`, service.sousServices);
          return {
            ...service,
            sousServices: service.sousServices || [],
          };
        });
        setService(updatedData);
      })
      .catch((error) => console.error('Erreur lors du chargement des services:', error));
  }, []);

  const renderGroupedHoraires = (horaires: { nom: string; heure: string }[] | undefined) => {
    if (!horaires) return null;

    const groupedHoraires = horaires.reduce((acc: Record<string, string[]>, horaire) => {
      if (!acc[horaire.nom]) {
        acc[horaire.nom] = [];
      }
      acc[horaire.nom].push(horaire.heure);
      return acc;
    }, {});

    return Object.entries(groupedHoraires).map(([nom, heures], idx) => (
      <div key={`horaire-group-${idx}`} className="mb-2 text-center">
        <h4 className="horaire-title">{nom}</h4>
        <div>
          {heures.map((heure, i) => (
            <p key={`heure-${i}`} className="card-text">
              {heure}
            </p>
          ))}
        </div>
      </div>
    ));
  };

  if (services.length === 0) {
    return <p>Chargement des services...</p>;
  }
  return (

    <section className="les-services">

      {services.map((service, index) => (
        <div
          key={service.nom}
          className={`service-section d-flex flex-column align-items-center  ${index === 0 ? "first-service" : index === services.length - 1 ? 'last-service' : ''
            }`}
        >
          {/* Affichage des sous-services */}
          {service.sousServices && service.sousServices.length > 0 && (
          <div className="col-10 sous-services-container d-flex align-items-center justify-content-center ">
            <div className='d-flex flex-column flex-md-row align-items-center justify-content-center h-100 w-100'>
              {service.sousServices && service.sousServices.map((sousService, sousIndex) => {
                const images = Array.isArray(sousService.image) ? sousService.image : [];
                const mainImage = images.find(img => !img.nom.includes("menu"));
                const menuImage = images.find(img => img.nom.includes("menu"));

                return (
                  <div
                    key={sousService.nom}
                    className={`col-8 col-x col-sm-4 d-flex  flex-row flex-md-column d-flex  justify-content-center align-items-center h-auto ${sousIndex === 0 ? "first-sous-service" : sousIndex === service.sousServices.length - 1 ? "last-sous-service" : ""}`}
                  >
                    <div className="sous-service-card  col-10 d-flex flex-column justify-content-center align-items-center text-center mb-md-5 p-1">
                      <div className=" bg-warning col-10 rounded-5 h-100 w-100 d-flex  flex-column align-items-center justify-content-center">
                        <h4 className="card sous-service-title">{sousService.nom}</h4>
                        <p className="card sous-service-description">{sousService.description}</p>
                        {menuImage && sousService.menu && (
                          <Button
                            variant="primary"
                            className="sous-services-btn w-80"
                            onClick={() => afficherMenuModal(menuImage.imagePath)}
                          >
                            Voir le menu
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="img-container col-10 d-flex justify-content-center align-items-center">
                      <div
                        className="card-body col-10 rounded-5  w-100 d-flex flex-column align-items-center justify-content-center mx-auto">
                        {/* Vérification de l'image */}
                        {Array.isArray(sousService.image) && sousService.image.length > 0 ? (
                          <div className="d-fex align-items-center">
                            <img
                              src={`http://127.0.0.1:8000${mainImage.imagePath}`}
                              alt={`Image de ${sousService.nom}`}
                              className="img-fluid sousService-img rounded-5"
                            />
                          </div>
                        ) : sousService.image && typeof sousService.image === "object" ? (
                          <div className="col-10 p-2">
                            <img
                              src={`http://127.0.0.1:8000${sousService.image.imagePath}`}
                              alt={`Image de ${sousService.nom}`}
                              className="img-fluid sousService-img rounded-5"
                            />
                          </div>
                        ) : (
                          <p className="text-muted">Image non disponible</p>
                        )}
                        


                        <Modal show={showMenuModal} onHide={closeMenuModal} centered>
                          <Modal.Header>
                            <Modal.Title>Menu</Modal.Title>
                            <Button variant="close bg-primary" onClick={closeMenuModal} aria-label="Fermer" className="ms-auto" />
                          </Modal.Header>
                          <Modal.Body className="text-center">
                            {menuImagePath && (
                              <img
                                src={`http://127.0.0.1:8000${menuImagePath}`}
                                alt="Image du menu"
                                className="img-fluid"
                              />
                            )}
                          </Modal.Body>
                        </Modal>
                        <Modal show={showCarteZoo} onHide={closeCarteZooModal} centered>
                          <Modal.Header>
                            <Modal.Title>Carte du Zoo</Modal.Title>
                            <Button variant="close bg-primary" onClick={closeCarteZooModal} aria-label="Fermer" className="ms-auto" />
                          </Modal.Header>
                          <Modal.Body className="text-center">
                            {carteZooImagePath && (
                              <img
                                src={`http://127.0.0.1:8000${carteZooImagePath}`}
                                alt="Carte du zoo"
                                className="img-fluid"
                              />
                            )}
                          </Modal.Body>
                        </Modal>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
          {index === 0 && (
            <>

              <img
                className="first-section-top-decoration w-100"
                src="/uploads/images/svgDeco/TopService.svg"
                alt="Top decoration pour la première section"
              />
              <img
                className="first-section-bottom-decoration w-100"
                src="/uploads/images/svgDeco/FormGreenMobil.svg"
                alt="decoration bas de la premiere section"
              />
            </>
          )}
          {index > 0 && index < services.length - 1 && (
            <>
              <img
                className="other-section-top-decoration w-100"
                src="/uploads/images/svgDeco/Slice green.svg"
                alt="Second top decoration pour la première section"
              />
              <img
                className="other-section-bottom-decoration w-100"
                src="/uploads/images/svgDeco/FormGreenMobil.svg"
                alt="decoration bas de la premiere section"
              />
            </>
          )}
          {index === services.length - 1 && (
            <>
              <img
                className="last-section-top-decoration w-100"
                src="/uploads/images/svgDeco/Slice green.svg"
                alt="Top decoration pour la dernière section"
              />
              <img
                className="last-section-bottom-decoration w-100"
                src="/uploads/images/svgDeco/demiElOrLgBotsvg.svg"
                alt="Décoration bas de la dernière section"
              />
            </>
          )}
          <h2 className="service-title text-white">{service.nom}</h2>


          {service.image && !service.carteZoo && (
            <div className="card-container d-flex justify-content-center align-items-center h-100">
              <div className="card d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column flex-sm-row w-100 text-center align-items-center justify-content-center g-0">
                  <div className='service-img col-6 col-lg-5'>
                    <img
                      src={`http://127.0.0.1:8000${service.image.imagePath}`}
                      alt={`Image de ${service.nom}`}
                      className="img-fluid rounded-5 col-10"
                    />
                  </div>
                  <div className="col-6 col-lg-5 d-flex justify-content-center">
                    <div
                      className="visite--card-body col-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center">
                      <p className="card service-description">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Affichage des horaires */}
          <div className='horaire-container d-flex justify-content-center flex-wrap w-100'>
            <div className="horaire-section d-flex align-items-center justify-content-center w-100 p-2 flex-wrap">
              {service.horaire && typeof service.horaire !== 'string' && (
                <>
                  <div className="d-flex justify-content-center col-md-6 col-12 px-2 h-100">
                    <div className="horaire-card bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center w-100 ">
                      {renderGroupedHoraires(service.horaire.horaire1)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-center col-md-6 col-12 px-2 h-100">
                    <div className="horaire-card  bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center w-100">
                      {renderGroupedHoraires(service.horaire.horaire2)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {service.carteZoo && (
            <Button className="btn-carte-zoo" onClick={() => afficherCarteZooModal(service.image?.imagePath || '')}>
              Afficher la carte zoo
            </Button>
          )}

        </div>
      ))}
    </section>
  );
};
