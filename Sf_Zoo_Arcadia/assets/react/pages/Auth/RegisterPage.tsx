import React, { useState } from 'react';
import {z} from "zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit avoir au moins 8 caractère" })
    .length(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[\W_]/, "Le mot de passe doit contenir au moins un caractère spécial."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
export const RegisterPage = () => {
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    email: "",
    password: "",
  });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setMessage(errors.join(', '));
        return;
      }
  
      if (formValues.password !== confirmPassword) {
        setMessage("Les mots de passe ne correspondent pas.");
        return;
      }
  
      try {
        const response = await fetch('/api/register/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formValues.email,
            plainPassword: formValues.password,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage('Inscription réussie !');
        } else {
          setMessage(`Erreur: ${data.errors.join(', ')}`);
        }
      } catch (error) {
        setMessage("Une erreur est survenue lors de l'inscription.");
      }
    };

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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};