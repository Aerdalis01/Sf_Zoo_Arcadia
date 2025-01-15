import React, { useState } from 'react';
import { Horaire } from '../../../../models/horaireInterface';



export const HoraireForm: React.FC = () => {
    const [formData, setFormData] = useState<Horaire>({
        horaireTexte: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("jwt_token");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formHoraire = new FormData();
        formHoraire.append('horaire', formData.horaireTexte);

        try {
            const response = await fetch('/api/horaire/new', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formHoraire,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Vous n'avez pas l'autorisation requise pour cette action.")
                    return Promise.reject("Unauthorized");
                }
            }

            const savedHoraire = await response.json();
            setFormData({ horaireTexte: '' });
            setSuccessMessage('Horaire enregistré avec succès !');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>


            {error && <p className="alert alert-danger">{error}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

            <label>
                Horaire texte :
                <textarea
                    name="horaireTexte"
                    placeholder="Exemple: Lundi: 09h00 - 18h00"
                    value={formData.horaireTexte}
                    onChange={(e) => setFormData({ ...formData, horaireTexte: e.target.value })}
                />
            </label>

            <button type="submit">Enregistrer</button>
        </form>
    );
};


