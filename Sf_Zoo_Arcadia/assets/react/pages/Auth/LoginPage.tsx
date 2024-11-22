
import React from "react";
import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";



const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>();
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formValues);

    if (!result.success) {
      
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.error("Erreur d'authentification :", data.error);
        setFormError(data.error || "Erreur d'authentification.");
        return;
      }

      const token = data.token;

      if (!token || typeof token !== "string") {
        console.error("Token invalide ou manquant :", token);
        setFormError("Token invalide ou manquant.");
        return;
      }

      
      localStorage.setItem("jwt_token", token);
      login(token);
      setSuccessMessage("Connexion réussie !");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setFormError("Une erreur réseau s'est produite.");
    }
  };

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
            <label htmlFor="email" className="form-label fs-5">
              Email
            </label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formValues.email}
              type="email"
              onChange={handleChange}
              placeholder="Entrez votre email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3 col-9">
            <label htmlFor="password" className="form-label fs-5">
              Mot de passe
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div>
            <button
              id="buttonConnexion"
              className="btn btn-primary"
              type="submit"
            >
              Se connecter
            </button>
          </div>
          {formError && <p className="text-danger">{formError}</p>}
          {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
        </form>
      </div>
    </section>
  );
};
