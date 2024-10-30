import React, { useState, useRef } from "react";
import { Contact } from '../../../../models/contactInterface';


interface FormErrors {
  email?: string;
  titre?: string;
  message?: string;
  submit?: string;
}

export function ContactForm({ handleFormToggle, onFormSuccess }) {
  const [formData, setFormData] = useState<Contact>({
    id: 0,
    email: "",
    titre: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation des champs
  const validateForm = () => {
    const errors: any = {};
    if (!formData.email) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    if (!formData.titre) errors.titre = 'Titre requis';
    if (!formData.message) errors.message = 'Message requis';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Créez un nouvel objet FormData et ajoutez-y les champs
    const formContact = new FormData();
    formContact .append('email', formData.email);
    formContact .append('titre', formData.titre);
    formContact .append('message', formData.message);
  
    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        body: formContact , 
      });

      if (response.ok) {
        setSuccessMessage('Votre message a été envoyé avec succès.');
        setFormData({ id: 0, email: '', titre: '', message: '' });
        setErrors({});
        onFormSuccess();
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <label>Titre</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
        />
        {errors.titre && <p>{errors.titre}</p>}
      </div>
      <div>
        <label>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <p>{errors.message}</p>}
      </div>
      <button type="submit">Envoyer</button>
      {errors.submit && <p>{errors.submit}</p>}
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
}
