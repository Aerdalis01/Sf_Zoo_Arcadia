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
// import { ContactPage } from "./react/pages/";
import { HabitatPage } from "./react/pages/HabitatPage";
import { DashboardPage } from "./react/pages/Dashboard";
import { InfoPage } from "./react/pages/InfoPage";
import { LoginPage } from "./react/pages/Auth/LoginPage";
import { RegisterPage } from "./react/pages/Auth/RegisterPage";

// import { HabitatCreate } from "./react/pages/HabitatCreate";
// import { HabitatUpdate } from "./react/pages/HabitatUpdate";
// import { HabitatDelete } from "./react/pages/HabitatDelete";
// import { AnimalCreate } from "./react/pages/AnimalCreate";
// import { AnimalDelete } from "./react/pages/AnimalDelete";
// import { AnimalUpdate } from "./react/pages/AnimalUpdate";
import { ServicePage } from "./react/pages/ServicesPage";
// import { ServiceCreate } from "./react/pages/ServiceCreate";
// import { ServiceUpdate } from "./react/pages/ServiceUpdate";
// import { ServiceDelete } from "./react/pages/ServiceDelete";
// import { SousServiceCreate } from "./react/pages/SousServiceCreate";
// import { SousServiceUpdate } from "./react/pages/SousServiceUpdate";
// import { SousServiceDelete } from "./react/pages/SousServiceDelete";
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
        {/* <Route path="/contact" element={<ContactPage />} /> */}
        <Route path="/info" element={<InfoPage />} />
        {/* <Route path="/habitat/create" element={<HabitatCreate />} />
        <Route path="/habitat/update" element={<HabitatUpdate />} />
        <Route path="/habitat/delete" element={<HabitatDelete />} /> */}
        {/* <Route path="/animal/create" element={<AnimalCreate />} />
        <Route path="/animal/delete" element={<AnimalDelete />} />
        <Route path="/animal/update" element={<AnimalUpdate />} /> */}
        <Route path="/service" element={<ServicePage />} />
        {/* <Route path="/service/create" element={<ServiceCreate />} />
        <Route path="/service/update" element={<ServiceUpdate />} />
        <Route path="/service/delete" element={<ServiceDelete />} />
        <Route path="/sousService/create" element={<SousServiceCreate />} />
        <Route path="/sousService/update" element={<SousServiceUpdate />} />
        <Route path="/sousService/delete" element={<SousServiceDelete />} /> */}
        
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
