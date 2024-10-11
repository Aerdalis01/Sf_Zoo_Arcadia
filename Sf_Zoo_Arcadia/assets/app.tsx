import React from 'react';
import {createRoot} from 'react-dom/client'
// import 'bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { registerReactControllerComponents } from '@symfony/ux-react';
// registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));
import './sass/app.scss';


// import Header  from './react/controllers/components/header';
// import Footer  from './react/controllers/components/footer';

import {LoginPage} from './react/pages/Auth/LoginPage'
import {RegisterPage} from './react/pages/Auth/RegisterPage'
import { ProtectedRoute } from './react/pages/Auth/Auth';
// import HomePage from './react/pages/HomePage';
// import ServicePage from './react/pages/ServicesPage';
// import { ServiceCreate } from './react/pages/ServiceCreate';
// import { ServiceUpdate } from './react/pages/ServiceUpdate';
// import { SousServiceCreate } from './react/pages/SousServiceCreate';
// import {AnimalCreate} from './react/pages/AnimalCreate';
// import {RaceCreate} from './react/pages/RaceCreate';


const App: React.FC = () => {
    return (
        <Router>
            {/* <Header/> */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <RegisterPage />
            </ProtectedRoute>
          } />
                {/* <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/services/create" element={<ServiceCreate />} />
                <Route path="/services/Update" element={<ServiceUpdate />} />
                <Route path="/sousService/create" element={<SousServiceCreate />} />
                <Route path="/animaux/create" element={<AnimalCreate />} />
                <Route path="/race/create" element={<RaceCreate />} /> */}

            </Routes>
            {/* <Footer/> */}
        </Router>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found");
}

