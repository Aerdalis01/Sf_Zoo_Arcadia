interface TextInputFieldProps {
  name: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({ name, value, label, onChange }) => (
  <div>
    <label>{label}</label>
    <input 
    className="form-control"
    type="text" name={name} value={value} onChange={onChange} />
  </div>
);
