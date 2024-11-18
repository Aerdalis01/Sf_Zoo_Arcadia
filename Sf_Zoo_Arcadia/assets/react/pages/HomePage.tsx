
import React, { useState, useEffect } from 'react';
import { renderStars, AvisForm } from '../controllers/components/form/Avis/AvisForm';
import { Carousel } from '../components/carousel';
import { ServicesSection } from '../components/ServicesHomePage';


interface Animal {
  animalId: number;
  nom: string;
  visites: number;
  imagePath: string | null;
}

export const HomePage = () => {

  const [latestAvis, setLatestAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [animals, setAnimals] = useState([]);

  const handleFormSuccess = (message: string) => {
    setShowForm(false);
    setSuccessMessage(message);
  };
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

 useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('/api/reporting');
        if (!response.ok) throw new Error("Erreur lors de la récupération des animaux populaires.");

        const data = await response.json();
        console.log(data);
        setAnimals(data.slice(0, 4)); // Limite aux 4 premiers animaux les plus populaires
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
    console.log(animals);

  }, []);
  


  const carouselItems = [
    {
      id: 'slide1',
      imgSrc: '/uploads/images/carousel/CerfBlancMobil.webp',
      altText: 'Cerf blanc dans la forêt',
      title: 'Bienvenue au Zoo Arcadia',
      description: 'Un zoo familial soucieux des animaux et de leur environnement...',
      className: 'carousel-img--accueil',
    },
    {
      id: 'slide2',
      imgSrc: '/uploads/images/carousel/bg-marais-carousel.webp',
      altText: 'Des flamants roses dans une zone humide',
      title: 'Le marais',
      description: 'Notre zone humide et boisé permet d’abriter de nombreuses espèces...',
      className: 'carousel-img--marais',
    },
    {
      id: 'slide3',
      imgSrc: '/uploads/images/carousel/Savane-sm.webp',
      altText: 'Image de la savane',
      title: 'La savanne',
      description: 'Découvrez un univers majestueux où se côtoient girafes, gnous et zèbres sur un terrain de 2 hectares',
      className: 'carousel-img--savane',
    },
    {
      id: 'slide4',
      imgSrc: '/uploads/images/carousel/bg-jungle-carousel.webp',
      altText: 'Image d\'une jungle',
      title: 'La jungle',
      description: 'Dans la luxuriante jungle d’Arcadia, vous pourrez découvrir nos chimpanzés, ouistitis ainsi que nombres d\'animaux étonnants et d\'oiseaux rares.',
      className: 'carousel-img--jungle',
    },

  ];

  useEffect(() => {
    const fetchLatestAvis = async () => {
      try {
        const response = await fetch('/api/avis/latest-avis', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis.');
        }

        const data = await response.json();
        setLatestAvis(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAvis();
  }, []);
  
  return (
    <>
      <section id="accueil">
        <div className="carousel-accueil">
          <Carousel items={carouselItems} />
        </div>
      </section>
      {/* Début section services */}
      <section className="services">
        <div className="content-greenSvg w-100">
          <img className="img-fluid w-100" src="/uploads/images/svgDeco/RecOvalVert.svg" alt="Forme géométrique de couleur verte" />
        </div>
        <div className="services-svg w-100 py-md-2 py-lg-3 py-xl-4 py-xxl-5">
          <div className="services-title text-center py-2">
            <h1 className="text-white">Services</h1>
            <h6 className="text-white">Retrouvez toutes nos offres</h6>
          </div>
          <div className="content-orangeSvg">
            <img className="svg-rectangle img-fluid w-100" src="/uploads/images/svgDeco/RecOrLg.svg" alt="Rectangle Orange" />
            <img className="svg-ellipse  w-100" src="/uploads/images/svgDeco/demiElOrmob.svg" alt="ellipse Orange" />
          </div>
        </div>
        <div>
          <ServicesSection />
        </div>
      </section>
      {/* Fin section services */}
      <section className="animaux">
        {/* Début section animaux*/}
        <img className="svg-top w-100" src="/uploads/images/svgDeco/SliceGreenMobil.svg" alt="demi-ellipse de couleur verte" />
        <img className="svg-left" src="/uploads/images/svgDeco/RonOr&verLeft.svg" alt="Demi ellipse verte et orange" />
        <img className="svg-right" src="/uploads/images/svgDeco/RonOr&verRight.svg" alt="Demi ellipse verte et orange" />
        <div className="services-title text-center py-2 mb-lg-5">
          <h1 className="text-white">Nos stars</h1>
          <h6 className="text-white">Retrouvez nos célébrités</h6>
        </div>
        {/* Animaux cards */}
        {animals.length === 0 ? (
        <p className="text-center text-white">Aucun animal disponible pour le moment.</p>
      ) : (
        <div className="container-animaux row row-cols-1 row-cols-md-3 g-4 d-flex justify-content-center mt-lg-5">
          {animals.map((animal, index) => (
            
      <div key={animal.animalId || index} className="col-6 mx-5 mx-md-2">
        <div className="card col-8 h-100 mx-auto">
          {animal.imagePath ? (
            <img
              src={`http://127.0.0.1:8000${animal.imagePath}`}
              
              alt={animal.nom}
              className="card-img-top rounded-circle"
            />
          ) : (
            <span>Pas d'image disponible</span>
          )}
          <div className="card-body rounded-5 text-center p-1">
            <h3 className="card-title">{animal.nom}</h3>
            <p className="card-text animaux-text">Nombre de visites : {animal.visites}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

      {successMessage &&
        <div className="alert alert-success">{successMessage}</div>}
      <hr className="hr-avis" />
      <section className="avis mb-5">
        <div className="container-fluid">
          <hr />
          <div className="avis-title bg-danger rounded-circle w-100 text-center py-2 mb-lg-5 mt-5">
            <h1 className="text-white">Avis</h1>
            <h6 className="text-white">Vos avis comptent.</h6>
          </div>
          <hr />
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {loading && <p>Chargement des avis...</p>}
            {error && <p>Erreur : {error}</p>}

            {latestAvis.map((avis) => (
              <div className="col" key={avis.id}>
                <div className="card-avis  rounded-lg text-center h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">{avis.nom}</h5>
                    <p>{new Date(avis.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="card-text">{avis.avis}</p>
                    <p className="card-text"><small className="text-muted">{renderStars(avis.note)}</small></p>
                  </div>
                </div>
              </div>
            ))}

            {!loading && latestAvis.length === 0 && <p>Aucun avis disponible pour le moment</p>}
          </div>
        </div>
        <hr />
        <div className="col-12 d-flex justify-content-center ">
          <button
            type="button"
            className="btn-avis btn-primary  h-100 col-lg-3 fs-5 fw-semibold rounded-3"
            onClick={handleFormToggle}
          >
            Donnez votre avis !
          </button>
        </div>

        {showForm && (
          <div className="overlay">
            <AvisForm handleFormToggle={handleFormToggle} onFormSuccess={handleFormSuccess} />
          </div>
        )}
      </section>

    </>
  );
};
