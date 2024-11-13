import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "./hashPassword";

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
    role:"",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        // Hacher le mot de passe avant de l'envoyer
        const hashedPassword = await hashPassword(formValues.password);
        console.log("Mot de passe haché:", hashedPassword);

        // Créer un nouvel objet avec le mot de passe haché
        const formDataToSend = {
            ...formValues,
            password: hashedPassword,
        };

        console.log("Données envoyées :", formDataToSend); // Vérifiez que le mot de passe haché est utilisé ici

        const response = await fetch("http://127.0.0.1:8000/api/admin/register/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToSend),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
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
    const checkAuth = async () => {
      try {
      } catch (error) {
        console.error("Utilisateur non authentifié, redirection vers login.");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div>
      <h1>Inscription</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Sélectionner un service */}
        <select name="role" onChange={handleSelectChange} defaultValue="">
          <option value="" disabled hidden>
            -- Sélectionner un rôle --
          </option>
          <option value="admin">Admin</option>
          <option value="employe">Employé</option>
          <option value="veterinaire">Vétérinaire</option>
        </select>
        <button type="submit">S'inscrire</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
};
