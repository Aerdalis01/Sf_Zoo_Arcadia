// interface SelectProps {
//   options: { id: number; nom: string }[]; 
//   value: number | null; 
//   onChange: (id: number) => void; 
//   label: string; 
// }


// export const SelectProps: React.FC<SelectProps> =({ options, value, onChange, label }) => {
//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     onChange(Number(e.target.value)); // Passer l'id sélectionné au parent
//   };
//   return (
//     <div>
//       <label>{label}</label>
//       <select value={value ?? ""} onChange={handleSelectChange}>
//         <option value="">-- Sélectionnez une option --</option>
//         {options.map((option, index) => (
//           <option key={option.id} value={option.id}>
//             {option.nom}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };
