interface HoraireFieldProps {
  horaireTexte: string;
  setHoraireTexte: (value: string) => void;
  label: string;
}

export const HoraireField: React.FC<HoraireFieldProps> = ({
  horaireTexte,
  setHoraireTexte,
  label,
}) => (
  <div>
    <label>{label}</label>
    <textarea
      placeholder="Exemple: Lundi: 09h00 - 18h00"
      value={horaireTexte}
      onChange={(e) => setHoraireTexte(e.target.value)}
    
    />
  </div>
);