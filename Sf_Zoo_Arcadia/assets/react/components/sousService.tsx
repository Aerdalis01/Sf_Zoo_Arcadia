// import React, { useState } from 'react';
// import { Accordion, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SousServiceComponent = ({ service }) => {
//   return (
//     <div className="col-10 sous-services-container d-flex align-items-center justify-content-center">
//       <div className="d-flex flex-column flex-md-row align-items-center justify-content-center h-100 w-100">
//         {service.sousServices &&
//           service.sousServices.map((sousService, sousIndex) => {
//             const images = Array.isArray(sousService.image) ? sousService.image : [];
//             const mainImage = images.find((img) => !img.nom.includes("menu"));
//             const menuImage = images.find((img) => img.nom.includes("menu"));

//             return (
//               <div
//                 key={sousService.nom}
//                 className={`col-8 col-sm-4 d-flex flex-column align-items-center h-auto ${
//                   sousIndex === 0
//                     ? "first-sous-service"
//                     : sousIndex === service.sousServices.length - 1
//                     ? "last-sous-service"
//                     : ""
//                 }`}
//               >
//                 <div className="img-container col-10 d-flex justify-content-center align-items-center">
//                   {mainImage ? (
//                     <img
//                       src={`http://127.0.0.1:8000${mainImage.imagePath}`}
//                       alt={`Image de ${sousService.nom}`}
//                       className="img-fluid sousService-img rounded-5"
//                     />
//                   ) : (
//                     <p className="text-muted">Image non disponible</p>
//                   )}
//                 </div>
//                 <Accordion className="w-100">
//                   <Accordion.Item eventKey={sousIndex.toString()}>
//                     <Accordion.Header>{sousService.nom}</Accordion.Header>
//                     <Accordion.Body>
//                       <p>{sousService.description}</p>
//                       {menuImage && sousService.menu && (
//                         <Button
//                           variant="primary"
//                           className="sous-services-btn w-80"
//                           onClick={() => afficherMenuModal(menuImage.imagePath)}
//                         >
//                           Voir le menu
//                         </Button>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 </Accordion>
//               </div>
//             );
//           })}
//       </div>
      
//     </div>
//   );
// };

