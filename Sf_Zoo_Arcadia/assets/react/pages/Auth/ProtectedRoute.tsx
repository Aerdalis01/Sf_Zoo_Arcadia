import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    alert("Vous devez être connecté pour accéder à cette page.");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRoles = decoded.roles || [];
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      return <Navigate to="/login" replace />;
    }

    const hasAccess = allowedRoles.some(role => userRoles.includes(role));
    if (!hasAccess) {
      alert("Accès interdit : rôle insuffisant.");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
