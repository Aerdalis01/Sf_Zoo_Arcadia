import React, { useState } from 'react';
import { Horaire } from '../../../../models/horaireInterface';



export const HoraireForm: React.FC = () => {
    const [formData, setFormData] = useState<Horaire>({
        horaireTexte: '',
    });
    const [error, setError] = useState<string>('');


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
                body: formHoraire,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'enregistrement de l\'horaire');
            }

            const savedHoraire = await response.json();
            console.log('Horaire enregistré:', savedHoraire);
            setFormData({ horaireTexte: '' });
        } catch (error) {
            setError(error.message);
            console.error('Erreur lors de l\'enregistrement de l\'horaire', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>


            {error && <p style={{ color: 'red' }}>{error}</p>}

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


