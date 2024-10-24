import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from 'jwt-decode';


const fetchAuth = async (url, options = {}) => {
  const token = localStorage.getItem('jwt_token');
  console.log("Token récupéré :", token);  

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Gérer l'accès non autorisé
    throw new Error("Accès non autorisé");
  }
  return response.json();
};

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    alert("Token non trouvé, redirection vers login");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    console.log('Payload du JWT :', decodedToken);
    // Extraire les rôles du token
    const userRoles = decodedToken.roles || [];
    console.log("Rôles de l'utilisateur :", userRoles);

    // Vérifiez si l'un des rôles de l'utilisateur correspond aux rôles autorisés
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      alert("Vous n'avez pas l'autorisation d'accéder à cette page.");
      return <Navigate to="/login" replace />;
    }

  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return <Navigate to="/login" replace />;
  }

  return children;
};