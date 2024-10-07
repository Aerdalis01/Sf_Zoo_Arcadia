import React from "react"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [succes, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplier tous les champs");
      return;
    }

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError("Erreur d'authentification");
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setSuccessMessage("Connexion réussie ! Redirection...");
      setError(null);
      setTimeout(() => {
        if (data.role === "Admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "Veterinaire") {
          navigate("/veterinaire-dashboard");
        } else if (data.role === "Employe") {
          navigate("/employe-dashboard");
        }
      }, 2000);
    } catch (error) {
      setError("Une erreur est survenue");
      setSuccessMessage(null);
    }
  };

  return (
    <section id="connexionPage" className="section-connexion text-center">
      <h1 className="pt-5">Connexion</h1>
      <div className="container-fluid connexion d-flex flex-column  align-items-center py-5">
        <form
          id="form-connexion"
          className="col-10 d-flex flex-column  align-items-center my-auto"
          onSubmit={handleSubmit}
        >
          <div className="mb-3 col-9">
            <label className="form-label fs-5">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 col-9">
            <label className="form-label fs-5">Mot de passe</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {succes && <div className="alert alert-success">{succes}</div>}
          <div>
            <button
              id="buttonConnexion"
              className="btn btn-primary"
              type="submit"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
