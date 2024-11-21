import { useEffect, useState } from 'react';
import { Service } from '../models/serviceInterface';
import { Modal, Button } from 'react-bootstrap';

export const ServicePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuImagePath, setMenuImagePath] = useState('');
  const [showCarteZoo, setShowCarteZoo] = useState(false);
  const [carteZooImagePath, setCarteZooImagePath] = useState('');



  const afficherMenuModal = (imagePath: string) => {
    setMenuImagePath(imagePath);
    setShowMenuModal(true);
  };

  const afficherCarteZooModal = (imagePath: string) => {
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
        setServices(data);
      })
      .catch((error) => console.error('Erreur lors du chargement des services:', error));
  }, []);


  
  if (services.length === 0) {
    return <p>Chargement des services...</p>;
  }

  return (
    <section className="les-services">
      {services.map((service, index) => {
        const sectionClassName =
          services.length === 1
            ? "first-service-section"
            : services.length === 2
              ? index === 0
                ? "first-service-section"
                : "last-service-section"
              : index === 0
                ? "first-service-section"
                : index === services.length - 1
                  ? "last-service-section"
                  : "middle-service-section";

        return (
          <div
            key={service.nom}
            id={`service-${service.nom.toLowerCase().replace(/\s+/g, '-')}`}
            className={`${sectionClassName}`}
          >
            {/* Décorations pour plusieurs sections */}
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
                  alt="Second top decoration pour les sections du milieu"
                />
                <img
                  className="other-section-bottom-decoration w-100"
                  src="/uploads/images/svgDeco/FormGreenMobil.svg"
                  alt="decoration bas de la section du milieu"
                />
              </>
            )}
            {services.length > 1 && index === services.length - 1 && (
              <>
                <img
                  className="last-section-top-decoration w-100"
                  src="/uploads/images/svgDeco/Slice green.svg"
                  alt="Top decoration pour la dernière section"
                />
                <img
                  className="last-section-bottom-decoration w-100 "
                  src="/uploads/images/svgDeco/demiElOrLgBotsvg.svg"
                  alt="Décoration bas de la dernière section"
                />
              </>
            )}

            <div className="section-content d-flex flex-column align-items-center w-100">
              <h2 className="service-title text-white">{service.nom}</h2>
            
              {/* Affichage des sous-services */}
              {service.sousServices && service.sousServices.length > 0 && (
                <div className="sous-services-container d-flex flex-column flex-md-row align-items-center justify-content-center my-5 p-0 w-100">
                  <div className="row justify-content-center mx-0">
                    {service.sousServices.map((sousService, sousIndex) => {
                      const images = Array.isArray(sousService.image) ? sousService.image : [];
                      const mainImage = images.find(img => !img.nom.includes("menu"));
                      const menuImage = images.find(img => img.nom.includes("menu"));

                      return (
                        <div
                          key={sousService.nom}
                          className={`sous-service col-11 col-md-3 d-flex flex-column justify-content-center align-items-center mx-sm-2 p-0 h-sm-100 ${sousIndex === 0 ? "first-sous-service" : sousIndex === service.sousServices.length - 1 ? "last-sous-service" : ""}`}
                        >
                          <div className="ratio-container col-6 col-md-12 d-flex flex-column justify-content-center align-items-center text-center mb-1 mb-sm-3 p-0">
                            <div className="content d-flex flex-column align-items-center justify-content-center bg-warning rounded-5 w-100">
                              <h4 className="card sous-service-title m-0">{sousService.nom}</h4>
                              <p className="card sous-service-description m-0">{sousService.description}</p>
                              {menuImage && sousService.menu && (
                                <Button
                                  variant="primary"
                                  className="sous-services-btn"
                                  onClick={() => afficherMenuModal(menuImage.imagePath)}
                                >
                                  Voir le menu
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="img-container d-flex justify-content-center align-items-center col-6 col-md-12 mb-1">
                            <div className="row w-100">
                              {Array.isArray(sousService.image) && sousService.image.length > 0 ? (
                                <div className="img-container d-flex justify-content-center p-0">
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${mainImage.imagePath}`}
                                    alt={`Image de ${sousService.nom}`}
                                    className="img-fluid sousService-img rounded-5"
                                  />
                                </div>
                              ) : (
                                <p className="text-muted">Image non disponible</p>
                              )}
                              <Modal show={showMenuModal} onHide={closeMenuModal} centered fullscreen>
                                <Modal.Header>
                                  <Modal.Title>Menu</Modal.Title>
                                  <img
                                    className="menu-exit ms-auto"
                                    src="/uploads/images/svgDeco/exit-croix-black.svg"
                                    alt="Image d'une croix"
                                    onClick={closeMenuModal}
                                  />
                                </Modal.Header>
                                <Modal.Body className="text-center">
                                  {menuImagePath && (
                                    <img
                                      src={`${process.env.REACT_APP_API_BASE_URL}${menuImagePath}`}
                                      alt="Image du menu"
                                      className="img-fluid"
                                    />
                                  )}
                                </Modal.Body>
                              </Modal>
                              <Modal show={showCarteZoo} onHide={closeCarteZooModal} centered fullscreen>
                                <Modal.Header>
                                  <Modal.Title>Carte du Zoo</Modal.Title>
                                  <img
                                    className="menu-exit ms-auto"
                                    src="/uploads/images/svgDeco/exit-croix-black.svg"
                                    alt="Image d'une croix"
                                    onClick={closeCarteZooModal}
                                  />
                                </Modal.Header>
                                <Modal.Body className="text-center w-100">
                                  {carteZooImagePath && (
                                    <img
                                      src={`${process.env.REACT_APP_API_BASE_URL}${carteZooImagePath}`}
                                      alt="Carte du zoo"
                                      className="img-fluid w-100"
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
              {service.image && !service.carteZoo && (
                <div className="card-container d-flex justify-content-center align-items-center h-100 my-5">
                  <div className="card d-flex align-items-center justify-content-center p-1">
                    <div className="d-flex flex-column flex-sm-row w-100 text-center align-items-center justify-content-center p-1">
                      <div className='service-img col-6 col-lg-5'>
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}${service.image.imagePath}`}
                          alt={`Image de ${service.nom}`}
                          className="img-fluid rounded-5 col-10 p-1"
                        />
                      </div>
                      <div className="col-6 col-lg-5 d-flex justify-content-center p-1">
                        <div
                          className="visite--card-body col-12 col-sm-10 bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center overflow-auto">
                          <p className="card service-description">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Affichage des horaires */}
              {service.horaireTexte && (
                <div className="horaire-container d-flex justify-content-center flex-column align-items-center w-75 my-5">
                  <div className="col-12 col-md-9 mb-3">
                    <div className="horaire-card bg-warning rounded-5 d-flex flex-column align-items-center justify-content-center">
                    {service.horaireTexte
                  .split(/\r?\n/)
                  .map((ligne, index) => (
                    <ul key={index}>
                      <li>{ligne}</li>
                    </ul>
                  ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton pour afficher la carte du zoo */}
              {service.carteZoo && (
                <Button className="btn-carte-zoo mb-2" onClick={() => afficherCarteZooModal(service.image?.imagePath || '')}>
                  Afficher la carte zoo
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};
