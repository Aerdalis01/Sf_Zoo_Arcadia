import "./styles/app.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap";
import "./sass/app.scss";

import { AuthProvider } from "./react/pages/Auth/AuthContext";

import Header from './react/components/header';
import Footer from './react/components/footer';
import { ProtectedRoute } from "./react/pages/Auth/Auth";


import { HomePage } from "./react/pages/HomePage";
import { ContactPage } from "./react/pages/ContactPage";
import { HabitatPage } from "./react/pages/HabitatPage";
import { DashboardPage } from "./react/pages/Dashboard";
import { InfoPage } from "./react/pages/InfoPage";
import { LoginPage } from "./react/pages/Auth/LoginPage";
import { RegisterPage } from "./react/pages/Auth/RegisterPage";
import { ServicePage } from "./react/pages/ServicesPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <RegisterPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/habitat" element={<HabitatPage />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/service" element={<ServicePage />} />
      </Routes>
      <Footer />
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
