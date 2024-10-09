import React from "react";

interface ServiceFormFieldsProps {
  serviceFormFieldsData: {
    description: string;
    titre: string;
    horaire: string;
    carteZoo: boolean;
  };
  setServiceFormFieldsData: React.Dispatch<React.SetStateAction<any>>;
}

export const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  serviceFormFieldsData,
  setServiceFormFieldsData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceFormFieldsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleHoraireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    try {
      // Valider que l'entrée est un JSON valide avant de l'enregistrer
      const parsedHoraire = JSON.parse(value);
      setServiceFormFieldsData((prevData) => ({
        ...prevData,
        horaire: JSON.stringify(parsedHoraire), // Reconvertir en JSON pour l'affichage
      }));
    } catch (err) {
      console.error("Horaire n'est pas un JSON valide", err);
    }
  };
  return (
    <div>

      <label>Description :</label>
      <textarea
        name="description"
        value={serviceFormFieldsData.description}
        onChange={handleChange}
      ></textarea>

      <label>Titre :</label>
      <input
        type="text"
        name="titre"
        value={serviceFormFieldsData.titre}
        onChange={handleChange}
      />

      <label>Horaire :</label>
      <input
        type="text"
        name="horaire"
        value={serviceFormFieldsData.horaire}
        onChange={handleChange}
      />

      <label>Carte Zoo :</label>
      <input
        type="checkbox"
        name="carteZoo"
        checked={serviceFormFieldsData.carteZoo}
        onChange={(e) =>
          setServiceFormFieldsData((prevData) => ({
            ...prevData,
            carteZoo: e.target.checked,
          }))
        }
      />
    </div>
  );
};