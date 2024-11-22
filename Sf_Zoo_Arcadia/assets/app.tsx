import "./styles/app.css";
import React, { useEffect }  from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap";
import "./sass/app.scss";
import axios from "axios";

import { AuthProvider } from "./react/pages/Auth/AuthContext";
import { Layout } from './react/components/layout';

import { ProtectedRoute } from "./react/pages/Auth/ProtectedRoute";


import { HomePage } from "./react/pages/HomePage";
import { ContactPage } from "./react/pages/ContactPage";
import { HabitatPage } from "./react/pages/HabitatPage";
import { DashboardPage } from "./react/pages/Dashboard";
import { LoginPage } from "./react/pages/Auth/LoginPage";
import { RegisterPage } from "./react/pages/Auth/RegisterPage";
import { ServicePage } from "./react/pages/ServicesPage";



const App: React.FC = () => {
  useEffect(() => {
    
    axios.interceptors.request.use((config) => {
      console.log("Authorization Header:", config.headers?.Authorization);
      return config;
    });
  }, []);
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/register"
              element={
                
                  <RegisterPage />
                
              }
            />
            <Route path="/habitat" element={<HabitatPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/service" element={<ServicePage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
