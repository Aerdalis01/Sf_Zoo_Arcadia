import { useEffect, useState } from 'react';
import   { Service } from '../models/serviceInterface'
import   { SousService } from '../models/sousServiceInterface'
import   {afficherCarteZoo} from '../controllers/components/modal/boutonCarteZoo'


export const ServicePage= () => {
  const[services, setService] = useState<Service[]>([]);
  const [sousService, setSousServices] = useState<SousService[]>([]);

  useEffect(() =>{
    fetch('/api/service')
    .then((response) => response.json())
    .then((data) => {
      setService(data);
    })
    .catch((error) => console.error('Erreur lors du chargement des services:', error));
}, []);
if (services.length === 0) {
  return <p>Chargement des services...</p>; 
}
return (
  <section className="les-services">

    {services.map((service, index) => (
      <div 
        key={service.nom} 
        className={`service-section ${
          index === 0 ? "first-service" : index === services.length - 1 ? 'last-service' : ''
        }`}
        >
          
      {index === 0 && (
            <>
              <img
                className="first-section-top-decoration"
                src="/uploads/images/svgDeco/RecOrMob.svg"
                alt="Top decoration pour la première section"
              />
              <img
                className="first-section-second-top-decoration"
                src="/uploads/images/svgDeco/demiElOrLg.svg"
                alt="Second top decoration pour la première section"
              />
            </>
          )}
        <h2 className="service-title">{service.nom}</h2>
        <p className="service-description">{service.description}</p>
        {service.carteZoo && (
            <button className="btn-carte-zoo" onClick={() => afficherCarteZoo(service.id)}>
              Afficher la carte zoo
            </button>
          )}
        {/* <div className="service-content">
          {service.sousServices.map((sousService) => (
            <div key={sousService.id} className="service-card">
              <h4 className="sous-service-title">{sousService.nom}</h4>
              <p className="sous-service-description">{sousService.description}</p>
            </div>
          ))}
        </div> */}
        {index === services.length - 1 && <img src="/uploads/images/svgDeco/demiElOrLgBotsvg.svg" alt="Last Service Decoration" />}
      </div>
    ))}
  </section>
);
};
