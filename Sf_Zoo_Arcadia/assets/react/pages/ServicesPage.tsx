import { useEffect, useState } from 'react';
import { Service } from '../models/serviceInterface'
import { SousService } from '../models/sousServiceInterface'
import { Modal, Button, CloseButton } from 'react-bootstrap';


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

      {services.map((service, index) => {
        // Définir la classe conditionnelle pour chaque section
        const sectionClassName =
          index === 0 ? "first-service-section" :
            index === services.length - 1 ? "last-service-section" :
              "middle-service-section";

        return (
          <div
            key={service.nom}
            className={`${sectionClassName}`}
          >
            {/* Affichage des sous-services */}
            {service.sousServices && service.sousServices.length > 0 && (
              <div className="sous-services-container d-flex flex-column align-items-center justify-content-center w-100">
                <div className='row justify-content-center '>
                  {service.sousServices && service.sousServices.map((sousService, sousIndex) => {
                    const images = Array.isArray(sousService.image) ? sousService.image : [];
                    const mainImage = images.find(img => !img.nom.includes("menu"));
                    const menuImage = images.find(img => img.nom.includes("menu"));

                    return (
                      <div
                        key={sousService.nom}
                        className={`col-12 col-md-11 col-lg-9 col-xl-6 d-flex flex-column flex-sm-row justify-content-center align-items-center ${sousIndex === 0 ? "first-sous-service" : sousIndex === service.sousServices.length - 1 ? "last-sous-service" : ""}`}
                      >
                        <div className="col-6 col-sm-4 d-flex flex-column flex-sm-row justify-content-center align-items-center text-center  col-5 mb-1">
                          <div className="d-flex  flex-column align-items-center justify-content-center bg-warning rounded-5 w-100">
                            <h4 className="card sous-service-title">{sousService.nom}</h4>
                            <p className="card sous-service-description">{sousService.description}</p>
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
                        <div className="img-container d-flex justify-content-center align-items-center col-5 mb-1">
                          <div className="row w-100">
                            {/* Vérification de l'image */}
                            {Array.isArray(sousService.image) && sousService.image.length > 0 ? (
                              <div className="d-flex justify-content-center">
                                <img
                                  src={`http://127.0.0.1:8000${mainImage.imagePath}`}
                                  alt={`Image de ${sousService.nom}`}
                                  className="img-fluid sousService-img rounded-5 w-75"
                                />
                              </div>
                            ) : sousService.image && typeof sousService.image === "object" ? (
                              <div className="">
                                <img
                                  src={`http://127.0.0.1:8000${sousService.image.imagePath}`}
                                  alt={`Image de ${sousService.nom}`}
                                  className="img-fluid sousService-img rounded-5 w-75 "
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
                                    src={`http://127.0.0.1:8000${menuImagePath}`}
                                    alt="Image du menu"
                                    className="img-fluid"
                                  />
                                )}
                              </Modal.Body>
                            </Modal>
                            <Modal show={showCarteZoo} onHide={closeCarteZooModal} centered fullscreen >
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
                                    src={`http://127.0.0.1:8000${carteZooImagePath}`}
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
                <div className="card d-flex align-items-center justify-content-center p-1">
                  <div className="d-flex flex-column flex-sm-row w-100 text-center align-items-center justify-content-center p-1">
                    <div className='service-img col-6 col-lg-5'>
                      <img
                        src={`http://127.0.0.1:8000${service.image.imagePath}`}
                        alt={`Image de ${service.nom}`}
                        className="img-fluid rounded-5 col-10 p-1"
                      />
                    </div>
                    <div className="col-6 col-lg-5 d-flex justify-content-center p-1">
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
            {service.horaire && typeof service.horaire !== 'string' && (service.horaire.horaire1 || service.horaire.horaire2) && (
              <div className='horaire-container d-flex justify-content-center w-50'>
                <div className="horaire-section d-flex align-items-center justify-content-center w-75">
                  {service.horaire && typeof service.horaire !== 'string' && (
                    <>
                      <div className="d-flex justify-content-center col-11 px-2 h-50">
                        <div className="horaire-card bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center w-100 ">
                          {renderGroupedHoraires(service.horaire.horaire1)}
                        </div>
                      </div>
                      <div className="d-flex justify-content-center col-11  px-2 h-50">
                        <div className="horaire-card  bg-warning rounded-5 h-100 d-flex flex-column align-items-center justify-content-center w-100">
                          {renderGroupedHoraires(service.horaire.horaire2)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {service.carteZoo && (
              <Button className="btn-carte-zoo" onClick={() => afficherCarteZooModal(service.image?.imagePath || '')}>
                Afficher la carte zoo
              </Button>
            )}

          </div>
        );
      })}
    </section>
  );
};
