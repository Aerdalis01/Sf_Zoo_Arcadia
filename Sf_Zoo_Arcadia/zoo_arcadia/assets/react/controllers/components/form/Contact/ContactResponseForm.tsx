import { get } from "axios";
import React, { useState, useEffect } from "react";

export function ContactResponseForm() {
  const [contactReports, setContactReports] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [contactData, setContactData] = useState<any | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const token = localStorage.getItem("jwt_token");

  const fetchContacts = () => {
    fetch("/api/contact")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des messages de contact");
        }
        return response.json();
      })
      .then((data) => {
        setContactReports(data);
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    fetchContacts();
  }, []);
  const handleSelectContact = (contactId: number) => {
    const selectedContact = contactReports.find(contact => contact.id === contactId);
    if (selectedContact) {
      setContactData(selectedContact);
      setSelectedContactId(contactId);
      setError(null); // Réinitialisation de l'erreur si un contact est sélectionné
    } else {
      setError("Message de contact non trouvé.");
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contactId = parseInt(e.target.value, 10);


    if (isNaN(contactId)) {
      setError("ID de message invalide.");
      return;
    }

    const selectedContact = contactReports.find(contact => contact.id === contactId);
    if (selectedContact) {
      setContactData(selectedContact);
    } else {
      setError("Message de contact non trouvé.");
    }

    setSelectedContactId(contactId);
  };


  const handleDeleteContact = async (contactId: number) => {

    try {
      const response = await fetch(`/api/contact/delete/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSuccessMessage("Le message a été supprimé avec succès.");
        fetchContacts();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (response.status === 401) {
        setError("Vous n'êtes pas autorisé à effectuer cette action.");
      } else {
        setError("Une erreur s'est produite lors de la suppression du message.");
      }
    } catch {
      setError("Impossible de supprimer le message. Vérifiez votre connexion.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (!selectedContactId) {
      setError("Aucun message de contact sélectionné.");
      return;
    }

    const formResponse = new URLSearchParams();
    formResponse.append("responseMessage", responseMessage);

    try {

      const response = await fetch(`/api/contact/respond/${selectedContactId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: formResponse.toString(),
      });

      if (response.ok) {
        const data = await response.json();

        setSuccessMessage("Réponse envoyée avec succès.");
        setResponseMessage("");
        setContactData(null);
        setSelectedContactId(null);
        setError(null);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000); // délai de 3 secondes
      } else if (response.status === 401) {
        setError("Vous n'êtes pas autorisé à effectuer cette action.");

      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de l'envoi de la réponse.");
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la requête.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <h2>Gestion des messages de contact</h2>
      {/* Tableau des messages de contact */}
      <div className="contact-table">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Titre</th>
              <th>Date d'envoi</th>
              <th>Répondu</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contactReports.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.email}</td>
                <td>{contact.titre}</td>
                <td>{contact.sendAt}</td>
                <td>{contact.isResponded ? "Oui" : "Non"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleSelectContact(contact.id)}>

                    Voir
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label htmlFor="contactSelect">Sélectionner un message :</label>
      <select id="contactSelect" onChange={handleSelectChange} value={selectedContactId || ""}>
        <option value="">Choisir un message</option>
        {contactReports.map((report) => (
          <option key={report.id} value={report.id}>
            {report.id} - {report.email}
          </option>
        ))}
      </select>

      {contactData && (
        <div>
          <h4>Message sélectionné :</h4>
          <p>Email : {contactData.email}</p>
          <p>Titre : {contactData.titre}</p>
          <p>Message : {contactData.message}</p>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="responseMessage" className="form-label">Réponse</label>
        <textarea
          className="form-control"
          id="responseMessage"
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Envoyer la réponse
      </button>
    </form>
  );
}
