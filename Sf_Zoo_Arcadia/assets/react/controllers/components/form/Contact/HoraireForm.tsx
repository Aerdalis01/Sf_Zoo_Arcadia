import React, { useState } from 'react';
import { Horaire } from '../../../../models/horaireInterface';



export const HoraireForm: React.FC = () => {
  const [formData, setFormData] = useState<Horaire>({
      jour: '',
      heureOuverture: '09:00',
      heureFermeture: '18:00',
  });
  const [error, setError] = useState<string>('');
  const joursDeLaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDayChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = e.target.value;
    setFormData({ ...formData, jour: selectedDay });

    if (selectedDay) {
        const response = await fetch(`/api/horaire/${selectedDay}`);
        if (response.ok) {
          const textResponse = await response.text(); // Lire le corps comme texte
          console.log("Réponse brute :", textResponse); // Log de la réponse brute
          const data = JSON.parse(textResponse); // Essayez de parser le texte en JSON
            setFormData({
                jour: data.jour,
                heureOuverture: data.heureOuverture.split('T')[1].substring(0, 5), 
                heureFermeture: data.heureFermeture.split('T')[1].substring(0, 5),
            });
        }
    } else {
        // Réinitialise le formulaire si aucun jour n'est sélectionné
        setFormData({
            jour: '',
            heureOuverture: '09:00',
            heureFermeture: '18:00',
        });
    }
};
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const formHoraire = new FormData();
      formHoraire.append('jour', formData.jour);
      formHoraire.append('heureOuverture', formData.heureOuverture);
      formHoraire.append('heureFermeture', formData.heureFermeture);

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
        setFormData({ jour: '', heureOuverture: '09:00', heureFermeture: '18:00' });
    } catch (error) {
        setError(error.message);
        console.error('Erreur lors de l\'enregistrement de l\'horaire', error);
    }
};

    return (
        <form onSubmit={handleSubmit}>
          <h2>Gestion des horaires</h2>
            <label>
                Jour :
                <select
                    name="jour"
                    value={formData.jour}
                    onChange={handleDayChange}
                    required
                >
                    <option value="">Sélectionnez un jour</option>
                    {joursDeLaSemaine.map((jour) => (
                        <option key={jour} value={jour}>
                            {jour}
                        </option>
                    ))}
                </select>
            </label>
            
            <label>
                Heure d'ouverture :
                <input
                    type="time"
                    name="heureOuverture"
                    value={formData.heureOuverture}
                    onChange={handleChange}
                    required
                />
            </label>
            
            <label>
                Heure de fermeture :
                <input
                    type="time"
                    name="heureFermeture"
                    value={formData.heureFermeture}
                    onChange={handleChange}
                    required
                />
            </label>

            <button type="submit">Enregistrer</button>
        </form>
    );
};


