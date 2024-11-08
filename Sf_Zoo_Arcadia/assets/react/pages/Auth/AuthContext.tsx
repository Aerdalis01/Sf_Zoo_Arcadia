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


  useEffect(() => {
    const roles = getRolesFromToken();
    if (roles.length > 0) {
      setUserRoles(roles);
      setIsConnected(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("jwt_token", token);
    const decodedToken: any = jwtDecode(token);
    setUserRoles(decodedToken.roles);
    setIsConnected(true);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setIsConnected(false);
    setUserRoles([]);
  };
  const getRolesFromToken = (): string[] => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.roles || [];
      } catch (error) {
        console.error("Erreur lors du décodage du token JWT", error);
      }
    }
    return [];
  };

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
