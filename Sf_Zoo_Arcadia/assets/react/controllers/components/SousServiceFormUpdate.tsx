// import { useState, useEffect } from "react";
// import { ImageForm } from "../../controllers/components/ImageForm";


// export function SousServiceFormUpdate() {
//   const [sousServices, setSousServices] = useState([]);
//   const [selectedSousServiceId, setSelectedSousServiceId] = useState<number | null>(
//     null
//   );
//   const [sousServiceData, setSousServiceData] = useState({
//     id: 0,
//     nomSousService: "",
//     titreSousService: "",
//     description: "",
//     typeSousService: "",
//   });

//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/sousServices")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Sous-services récupérés :", data);
//         setSousServices(data); // Mettre à jour l'état des services
//       })
//       .catch((error) => {
//         console.error("Erreur lors du chargement des services :", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedSousServiceId !== null) {
//       fetch(`/api/sousService/${selectedSousServiceId}`)
//         .then((response) => {
//           console.log("Réponse brute:", response);
//           if (!response.ok) {
//             throw new Error("Erreur lors du chargement des services");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Services récupérés :", data);
          
//           setSousServiceData({
//             id: data.id || 0,
//             nomSousService: data.nomService || '',
//             titreSousService: data.titreService || '',
//             description: data.description || '',
//             typeSousService: data.typeService || '',
//           });
//         })
//         .catch((error) => {
//           console.error("Erreur lors du chargement des données du service:", error);
//         });
//     }
//   }, [selectedServiceId]);

//   //Gestion du changement du select
//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedServiceId(Number(e.target.value));
//   };

//   // Gestion des changements pour les champs de service
//   const handleServiceChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setServiceData({
//       ...serviceData,
//       [name]: value,
//     });
//   };
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formService = new FormData();
//     console.log("Service Data:", serviceData);
//     formService.append('nomService', serviceData.nomService);
//     formService.append('description', serviceData.description);
//     formService.append('typeService', serviceData.typeService);
//     formService.append('titreService', serviceData.titreService);

//       if (file) {
//         //Appel du timestamp pour générer un nom d'image unique
//         const timestamp = new Date().getTime();
//         //utilisation du timestamp dans le nom de l'image
//         const imageNameGenerated = `${serviceData.nomService}-${timestamp}`;
//         //enregistrament automatique du chemin de l'image
//         const imagePathGenerated = `/${serviceData.nomService.toLowerCase()}`;
//         const imageSubDirectory = `/uploads/images/services/${imageNameGenerated}`;

//       formService.append('file', file);
//       formService.append('nom', imageNameGenerated);
//       formService.append('image_sub_directory', `/uploads/images/services/${imageNameGenerated}`);
//       }
    
//     console.log("Données envoyées :", Array.from((formService as any).entries()));

//     fetch(`/api/services/${selectedServiceId}`, {
//       method: "POST", 
//       body: formService,
//     })
//       .then((response) => {
//         if (!response.ok) {
//             throw new Error("Erreur lors de la mise à jour du service");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setSuccessMessage("Service mis à jour avec succès !");
//         setError(null);
//       })
//       .catch((error) => {
//         setError("Erreur lors de la mise à jour du service.");
//         setSuccessMessage(null);
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Modifier un Service</h3>

//       {/* Sélectionner un service */}
//       <select onChange={handleSelectChange} defaultValue="">
//         <option value="" disabled>
//           Sélectionner un service
//         </option>
//         {services.map((service: any) => (
//           <option key={service.id} value={service.id}>
//             {service.nomService}
//           </option>
//         ))}
//       </select>
//       <div>
//         <label>Type de service :</label>
//         <select
//           name="typeService"
//           value={serviceData.typeService}
//           onChange={handleServiceChange}
//         >
//           <option value="">Sélectionner un type de service</option>
//           <option value="restauration">Restauration</option>
//           <option value="visite_guidee">Visite Guidée</option>
//           <option value="petit_train">Petit Train</option>
//           <option value="info_service">Info Service</option>
//         </select>
//       </div>
//       <div>
//         <label>Nom du service :</label>
//         <input
//           type="text"
//           name="nomService"
//           value={serviceData.nomService}
//           onChange={handleServiceChange}
//         />
//       </div>
//       <div>
//         <label>Titre du service :</label>
//         <input
//           type="text"
//           name="titreService"
//           value={serviceData.titreService}
//           onChange={handleServiceChange}
//         />
//       </div>
//       <div>
//         <label>Description :</label>
//         <input
//           type="text"
//           name="description"
//           value={serviceData.description}
//           onChange={handleServiceChange}
//         />
//       </div>

//       <ImageForm serviceName={serviceData.nomService} onImageSelect={setFile} />

//       <button type="submit">Mettre à jour</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
//     </form>
//   );
// }
