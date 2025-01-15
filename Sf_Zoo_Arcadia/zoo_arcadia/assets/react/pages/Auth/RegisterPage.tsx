import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const registerSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),

  password: z
    .string()
    .min(8, { message: "Le mot de passe doit avoir au moins 8 caractère" })
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(
      /[\W_]/,
      "Le mot de passe doit contenir au moins un caractère spécial."
    ),
  role: z.string().min(1, { message: "Un rôle doit être sélectionné." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    email: "",
    password: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { connected, hasRole } = useAuth();

  useEffect(() => {
    if (!connected || !hasRole("ROLE_ADMIN")) {
      console.error("Accès interdit : rôle administrateur requis.");
      navigate("/login");
    }
  }, [connected, hasRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    console.log(token);
    const result = registerSchema.safeParse(formValues);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      setMessage(errors.join(", "));
      return;
    }
    if (formValues.password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const formDataToSend = {
        ...formValues,
      };
      const response = await fetch("/api/admin/register/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formDataToSend),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setSuccessMessage("Inscription réussie !");
          setMessage(null);
        } else {
          const errorMessage = Array.isArray(data.errors)
            ? data.errors.join(", ")
            : data.errors || "Une erreur inconnue est survenue.";
          setMessage(`Erreur: ${errorMessage}`);
        }
      } else {
        const text = await response.text();
        console.error("Réponse non JSON:", text);
        setMessage("La réponse du serveur n'est pas au format JSON.");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setMessage("Une erreur est survenue lors de l'inscription.");
    }
  };


  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        console.error("Aucun token trouvé. Redirection vers login.");
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode<any>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          console.error("Token expiré. Redirection vers login.");
          localStorage.removeItem("jwt_token");
          navigate("/login");
          return;
        }

        const roles = decodedToken.roles || [];
        if (!roles.includes("ROLE_ADMIN")) {
          console.error("Accès interdit : rôle administrateur requis.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        localStorage.removeItem("jwt_token");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);



  return (
    <section id="connexionPage" className="section-connexion text-center">
      <div>
        <h1>Inscription</h1>
        <div className="container-fluid connexion d-flex flex-column  align-items-center py-5"></div>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 col-9">
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-9">
            <label>Mot de passe :</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-9">
            <label>Confirmer le mot de passe :</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <select name="role" onChange={handleSelectChange} defaultValue="">
            <option value="" disabled hidden>
              -- Sélectionner un rôle --
            </option>
            <option value="employe">Employé</option>
            <option value="veterinaire">Vétérinaire</option>
            <option value="visiteur">Visiteur</option>
          </select>
          <button type="submit">S'inscrire</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </form>
      </div>
    </section>
  );
};
