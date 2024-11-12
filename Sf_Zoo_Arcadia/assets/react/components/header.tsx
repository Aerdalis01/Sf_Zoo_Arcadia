import { useState, useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../pages/Auth/AuthContext";
import { BoxArrowRight } from 'react-bootstrap-icons';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';



const Header: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { connected, userRoles, logout } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  interface DecodedToken {
    roles: string[];
    exp: number;
  }

  const handleLogout = () => {
    logout();
    setSuccessMessage('Vous êtes bien déconnecté');
    setTimeout(() => setSuccessMessage(null), 3000);
    navigate('/');
  };

  useEffect(() => {
    console.log("connected:", connected, "userRoles:", userRoles); // Vérifiez que ces valeurs sont à jour
  }, [connected, userRoles]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 5000 <= Date.now()) {
          localStorage.removeItem('jwt_token');
          handleLogout();

        }
      } catch (err) {
        console.error('Erreur lors du décodage du jwt_token:', err);
      }
    }
  }, [logout]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleLoginDirection = () => {
    setSuccessMessage(null);
    navigate('/login');

  };
  const LogoutButton = () => {
    const renderTooltip = (props: any) => (
      <Tooltip id="button-tooltip" {...props}>
        Déconnexion
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="bottom" overlay={renderTooltip}>
        <Button variant="outline-secondary border-warning" onClick={handleLogout}>
          <BoxArrowRight className="text-warning " />
        </Button>
      </OverlayTrigger>
    );
  };
  return (

    <header id="header" className="header">
      <nav className="navbar navbar-expand-md bg-primary h-100 z-3 ">
        <div className="container-fluid justify-content-center">
          <div className="row w-100">
            <div className="container__menu-burger col-4 d-flex justify-content-start align-items-center">
              <img
                className="menu-burger"
                src="/uploads/images/svgDeco/Burger Nav.svg"
                alt="Menu burger"
                onClick={toggleModal}
              />
            </div>
            <div className="container__logo-arcadia col-4 col-md-2  d-flex  justify-content-center justify-content-md-start">
              <a className="navbar-brand m-0" href="/">
                <img
                  className="logo-arcadia align-self-center"
                  src="/uploads/images/svgDeco/Logo.svg"
                  alt="Logo du zoo Arcadia"
                />
              </a>
              <h3 className="align-items-center text-center px-4 text-warning d-none d-lg-flex">
                Zoo Arcadia
              </h3>
            </div>
            <div
              className="collapse navbar-collapse col-7 col-xl-8"
              id="navbarNav"
            >
              <ul className="navbar-nav text-center w-100 d-flex justify-content-center">
                <li className="nav-item col-2 ">
                  <a
                    className="nav-link active text-warning fw-semibold fs-5"
                    aria-current="page"
                    href="/"
                  >
                    Accueil
                  </a>
                </li>
                <li className="nav-item col-2">
                  <a
                    className="nav-link text-warning fw-semibold fs-5"
                    href="/service"
                  >
                    Services
                  </a>
                </li>
                <li className="nav-item col-2">
                  <a
                    className="nav-link text-warning fw-semibold fs-5"
                    href="/habitat"
                  >
                    Habitats
                  </a>
                </li>
                <li className="nav-item col-2">
                  <a
                    className="nav-link text-warning fw-semibold fs-5"
                    href="/contact"
                  >
                    Contact
                  </a>
                </li>
                {connected && (
                  <li className="nav-item col-2" >
                    <div>
                      {userRoles.includes('ROLE_EMPLOYE') && (
                        <a
                          className="nav-link text-warning fw-semibold fs-5"
                          href="/dashboard"
                        >
                          Espace employe
                        </a>)}
                      {userRoles.includes('ROLE_VETERINAIRE') && (
                        <a
                          className="nav-link text-warning fw-semibold fs-5"
                          href="/dashboard"
                        >
                          Espace vétérinaire
                        </a>)}
                      {userRoles.includes('ROLE_ADMIN') && (
                        <a
                          className="nav-link text-warning fw-semibold fs-5"
                          href="/dashboard"

                        >
                          Espace admin
                        </a>)}
                    </div>
                  </li>)}
              </ul>
            </div>
            <div className="container__icone-user col-4  d-flex align-items-center justify-content-end ">
              {!connected ? (
                <img
                  className="icon-user"
                  src="/uploads/images/svgDeco/Seconnecter.svg"
                  alt="Icone se connecter"
                  onClick={handleLoginDirection}
                />
              ) : (
                <LogoutButton />)}
            </div>

            <div className="container-btn--navbar  col-md-2  col-xl-2 d-flex align-items-center justify-content-end">
              {!connected ? (
                <button
                  id="btnNavbarCo"
                  className="btn btn-navbar btn-warning text-dark fw-semibold px-2"
                  type="button"
                  onClick={handleLoginDirection}
                >
                  Se connecter
                </button>
              ) : (
                <button
                  id="btnNavbarDeco"
                  className="btn col-10 btn-navbar--deco btn-warning text-dark fw-semibold px-2 "
                  type="button"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>)}
            </div>
          </div>
        </div>
      </nav>
      {/* Modal Menu */}
      <div className={`container-fluid modal-menu ${isModalOpen ? 'd-flex' : 'd-none'} flex-column align-items-center text-center h-100 w-100 p-0`}>
        <div className="content-exit d-flex justify-content-center align-items-center bg-primary w-100">
          <a className="logo" href="/">
            <img src="/uploads/images/svgDeco/Logo.svg" alt="Logo du zoo Arcadia" />
          </a>
          <img className="menu-exit" src="/uploads/images/svgDeco/croix.svg" alt="Image d'une croix"
            onClick={toggleModal} />
        </div>
        <ul className="navbar-nav text-center d-flex align-items-center mb-1 w-100">
          <li className="nav-item col-3 mb-1">
            <a className="nav-link fs-1 active fw-semibold" aria-current="page" href="/">
              Accueil
            </a>
          </li>
          <li className="nav-item col-3 mb-1">
            <a className="nav-link fs-1 fw-semibold" href="/service">
              Service
            </a>
          </li>
          <li className="nav-item col-3 mb-1">
            <a className="nav-link fs-1 fw-semibold" href="/habitat">
              Habitats
            </a>
          </li>
          <li className="nav-item col-3 mb-1">
            <a className="nav-link fs-1 fw-semibold" href="/contact">
              Contact
            </a>
          </li>
          {connected && (
            <li className="nav-item col-3 mb-1">
              {userRoles.includes('ROLE_EMPLOYE') && (
                <a className="nav-link fs-1 fw-semibold" href="/dashboard">
                  Espace employé
                </a>
              )}
              {userRoles.includes('ROLE_VETERINAIRE') && (
                <a className="nav-link fs-1 fw-semibold" href="/dashboard">
                  Espace vétérinaire
                </a>
              )}
              {userRoles.includes('ROLE_ADMIN') && (
                <a className="nav-link fs-1 fw-semibold" href="/dashboard">
                  Espace admin
                </a>
              )}
            </li>
          )}
          {connected ? (

            <li className="nav-item item-connexion col-3 mb-5 w-100">
              <a id="btn3NavbarDeco" className="nav-link--deco  fs-1 fw-semibold" onClick={logout}>
                Se déconnecter
              </a>
            </li>
          ) : (

            <li className="nav-item item-connexion col-3 mb-5 w-100">
              <a className="nav-link text-warning fs-1 fw-semibold" href='/login'>
                Se connecter
              </a>
            </li>
          )}
        </ul>
      </div>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
    </header>
  );
};

export default Header;
