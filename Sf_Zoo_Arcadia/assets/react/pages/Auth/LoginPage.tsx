import { jwtDecode } from "jwt-decode";
import React from "react";
import { useState } from "react";
import { z } from "zod";

// Define the schema for the form using Zod
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
  const [succes, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formValues);

    if (result.success) {
      const response = await fetch("http://symfony.local/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });
      if (response.ok) {
        const { token } = await response.json();
        setSuccess("Login successful! Token: " + token);
        localStorage.setItem('jwt_token', token)

        const decodedToken: any = jwtDecode(token);
        console.log("Token décodé complet :", decodedToken);

        // Les rôles sont un tableau, donc vous pouvez les stocker comme une chaîne JSON dans le localStorage
        const userRoles = decodedToken.roles || [];
        localStorage.setItem("ROLE", JSON.stringify(userRoles));

        console.log("Rôle(s) de l'utilisateur :", userRoles);
      } else {
        setFormError("Failed to login. Please try again.");
      }
    } else {
      // Gestion des erreurs de validation
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  // Handle input changes
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
        </form>
      </div>
    </section>
  );
};
