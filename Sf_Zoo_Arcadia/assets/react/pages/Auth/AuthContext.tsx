// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  connected: boolean;
  userRoles: string[];
  login: (token: string) => void;
  logout: () => void;
  getRolesFromToken: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connected, setIsConnected] = useState<boolean>(!!localStorage.getItem("jwt_token"));
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
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
    localStorage.setItem("jwt_token", token);
    const decodedToken: any = jwtDecode(token);
    console.log("Rôles de l'utilisateur à la connexion :", decodedToken.roles);
    setUserRoles(Array.isArray(decodedToken.roles) ? decodedToken.roles : []);
    setIsConnected(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      localStorage.removeItem("jwt_token");
      setIsConnected(false);
      setUserRoles([]);
      navigate("/login");
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

  return (
    <AuthContext.Provider value={{ connected, userRoles, login, logout, getRolesFromToken }}>
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
