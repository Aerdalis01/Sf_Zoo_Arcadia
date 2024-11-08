// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   allowedRoles?: string[];
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
//   const { connected, userRoles } = useAuth();

//   // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
//   if (!connected) {
//     return <Navigate to="/login" replace />;
//   }

//   // Si des rôles sont spécifiés, vérifier si l'utilisateur a au moins un des rôles requis
//   const hasAccess = allowedRoles.length === 0 || allowedRoles.some(role => userRoles.includes(role));

//   // Si l'utilisateur n'a pas les rôles requis, rediriger vers une page d'accès refusé
//   if (!hasAccess) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Si toutes les conditions sont remplies, rendre le composant enfant
//   return children;
// };

