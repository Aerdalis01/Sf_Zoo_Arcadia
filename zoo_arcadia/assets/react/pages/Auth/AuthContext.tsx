
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';


interface AuthContextType {
  connected: boolean;
  userRoles: string[];
  login: (token: string) => void;
  logout: () => void;
  getRolesFromToken: () => string[];
  hasRole: (role: string) => boolean;
}
interface DecodedToken {
  exp: number; 
  roles?: string[]; 
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connected, setIsConnected] = useState<boolean>(!!localStorage.getItem("jwt_token"));
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'expiration du token :", error);
      return true; 
    }
  };
 

  const getRolesFromToken = (): string[] => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return Array.isArray(decodedToken.roles) ? decodedToken.roles : [];
      } catch (error) {
        console.error("Erreur lors de la décodification du token :", error);
      }
    }
    return [];
  };

  const login = (token: string) => {
    if (!token || typeof token !== "string") {
      console.error("Token invalide ou manquant :", token);
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log("Token décodé :", decodedToken);
      localStorage.setItem("jwt_token", token);
      setUserRoles(decodedToken.roles || []);
      setIsConnected(true);
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  };
  
  const logout = async () => {
    try {
        const token = localStorage.getItem("jwt_token");
        
        if (!token) {
            console.error("Aucun token trouvé pour la déconnexion.");
            return;
        }

        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`, // Envoyer le token existant dans l'en-tête Authorization
          },
        });
        if (response.ok) {
          // Logique de suppression du token
          localStorage.removeItem("jwt_token");
          setIsConnected(false);
          setUserRoles([]);
          navigate("/login");
        } else {
          console.error("Erreur lors de la déconnexion");
        }
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
      }
    };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token && !isTokenExpired(token)) {
      setUserRoles(getRolesFromToken());
      setIsConnected(true);
    } else if (token) {
      logout();
    }
  }, []);
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };
  return (
    <AuthContext.Provider value={{ connected, userRoles, login, logout, getRolesFromToken, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
