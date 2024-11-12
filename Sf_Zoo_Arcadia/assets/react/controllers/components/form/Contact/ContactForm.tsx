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
        setTimeout(() => {
          setSuccessMessage(null);
      }, 3000); // délai de 3 secondes
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} 
    className="col-10 d-flex flex-column  align-items-center my-auto h-100">
      <div className="mb-3 col-10">
        <label htmlFor="email" className="form-label fs-5">Email</label>
        <input
        className={`form-control ${errors.email ? "is-invalid" : ""}`}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Entrez votre email"
        />
       {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
      </div>
      <div className="mb-3 col-10">
        <label className="form-label fs-5">Titre</label>
        <input
          className="form-control"
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
        />
        {errors.titre && <p>{errors.titre}</p>}
      </div>
      <div className="mb-3 col-10">
        <label>Message</label>
        <textarea
        className="form-control"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <p>{errors.message}</p>}
      </div>
      <button className="btn btn-primary" type="submit">Envoyer</button>
      {errors.submit && <p>{errors.submit}</p>}
      {successMessage && <p>{successMessage}</p>}
    </form>
  )
}
