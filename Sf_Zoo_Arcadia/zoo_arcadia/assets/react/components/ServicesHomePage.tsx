import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const goToServicePage = () => {
    navigate('/service'); 
  };

  useEffect(() => {

    fetch('/api/service')
      .then((response) => response.json())
      .then((data) => {
        // Filtrer les services pour exclure "InfoService"
        const filteredServices = data.filter(service => service.nom !== "InfoService");

        // Ajouter les images de sous-services pour les services sans image
        const updatedServices = filteredServices.map(service => {
          if (!service.image && service.sousServices && service.sousServices.length > 0) {
            // Choisir les images des sous-services pour le carrousel
            const filteredSousServiceImages = service.sousServices.flatMap(sub =>
              sub.image.filter(img => !img.nom.includes("menu")) // Exclure les images avec "carte" dans le nom
            );
            return {
              ...service,
              sousServiceImages: filteredSousServiceImages
            };
          }
          return service;
        });

        setServices(updatedServices);
      })
      .catch((error) => console.error('Erreur lors du chargement des services:', error));
  }, []);

  if (services.length === 0) {
    return <p>Chargement des services...</p>;
  }

  return (
    <section className="les-services d-flex align-items-center justify-content-center pb-5">
     <div className='row col-10'>
      {services.map(service => (
        <div key={service.nom} className="card col-6  d-flex justify-content-center ">
          <div className="card accueil-services--item" data-section={service.nom}>
            <div className="row w-100 text-center d-flex flex-row justify-content-center g-0">
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <div className="img-service col-12 col-lg-6 ">
                  {service.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${service.image.imagePath}`}
                      className="img-fluid rounded-5"
                      alt={`Image de ${service.nom}`}
                    />
                  ) : (
                    // Carrousel pour les services avec des sous-services sans image directe
                    <Carousel className='carousel-service' interval={3000} indicators={false} controls={false} style={{ height: 'auto' }}>
                      {service.sousServiceImages && service.sousServiceImages.map((image, index) => (
                        <Carousel.Item key={index} >
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${image.imagePath}`}
                            className="d-block w-100 rounded-5"
                            alt={`Image de ${service.nom} - ${index + 1}`}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div className="col-12 col-md-9 col-lg-6 d-flex justify-content-center p-2">
                  <div className="card-body bg-warning rounded-5 p-1">
                    <h4 className="card-title">{service.nom}</h4>
                  </div>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
      <button className="btn-service btn-col-8  rounded-5 mt-2 fs-5" onClick={goToServicePage}>
                  Voir plus
                </button>
    </section>
  );
};
