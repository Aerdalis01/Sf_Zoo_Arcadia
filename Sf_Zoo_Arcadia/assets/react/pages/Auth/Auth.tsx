import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from 'jwt-decode';


export const fetchAuth = async (url: string,  options: RequestInit = {}) => {
  const token = localStorage.getItem('jwt_token');


  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  if (options.headers) {
    const additionalHeaders = options.headers as Record<string, string>;
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  const response = await fetch(url, {
    ...options,
    headers, // Utilisation de l'instance de Headers
  });

  if (response.status === 401) {
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

    const userRoles = decodedToken.roles || [];

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