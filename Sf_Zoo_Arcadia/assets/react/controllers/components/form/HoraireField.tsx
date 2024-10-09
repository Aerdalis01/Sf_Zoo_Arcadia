interface HoraireFieldProps {
  horaireNom: string;
  horaireInput: string;
  setHoraireNom: (value: string) => void;
  setHoraireInput: (value: string) => void;
  horaires: { nom: string; heure: string }[];
  ajouterHoraire: () => void;
  label: string;
}

export const HoraireField: React.FC<HoraireFieldProps> = ({
  horaireNom,
  horaireInput,
  setHoraireNom,
  setHoraireInput,
  horaires,
  ajouterHoraire,
  label,
}) => (
  <div>
    <label>Nom de l'horaire :</label>
    <input
      type="text"
      placeholder="Nom de l'horaire"
      value={horaireNom}
      onChange={(e) => setHoraireNom(e.target.value)}
    />
    <label>Horaire :</label>
    <input
      type="time"
      value={horaireInput}
      onChange={(e) => setHoraireInput(e.target.value)}
    />
    <button type="button" onClick={ajouterHoraire}>
      Ajouter Horaire
    </button>
    <ul>
      {horaires.map((horaire, index) => (
        <li key={index}>
          {horaire.nom} - {horaire.heure}
        </li>
      ))}
    </ul>
  </div>
);
