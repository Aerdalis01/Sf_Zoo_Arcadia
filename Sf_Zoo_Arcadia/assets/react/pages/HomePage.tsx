
import React, { useState, useEffect } from 'react';
import { renderStars, AvisForm } from '../controllers/components/form/Avis/AvisForm';



export const HomePage = () => {

  const [latestAvis, setLatestAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSuccess = (message: string) => {
    setShowForm(false); 
    setSuccessMessage(message);
  };
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null); // Masquer le message après 5 secondes
      }, 5000);

      return () => clearTimeout(timer); // Nettoyer le timer
    }
  }, [successMessage]);

const handleFormToggle = () => {
    setShowForm(!showForm);
    
  };


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
    {successMessage && 
    <div className="alert alert-success">{successMessage}</div>}
      <hr className="hr-avis"/>
      <section className="avis mb-5">
        <div className="container-fluid">
          <hr/>
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
                    <p>Créé le : {new Date(avis.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
          <AvisForm handleFormToggle={handleFormToggle} onFormSuccess={handleFormSuccess}/>
        </div>
        )}
      </section>
      </>
    );
  };
  