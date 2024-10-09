import React from 'react';
import  {useState} from 'react';

export interface ImageFormProps {
  serviceName: string;
  onImageSelect: (file: File | null) =>void
}

export const ImageForm: React.FC<ImageFormProps> = ({ serviceName, onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onImageSelect(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
          setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file); // Lire l'image en tant qu'URL de données
  } else {
      onImageSelect(null); // Aucun fichier sélectionné
      setImagePreview(null); // Réinitialiser l'aperçu
  }
};

  return (
    
      <div>
        <label htmlFor="image">Select Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
                <div>
                    <h4>Aperçu de l'image:</h4>
                    <img src={imagePreview} alt="Aperçu" style={{ width: '100px', height: 'auto' }} />
                </div>
            )}
      </div>
    
  );
};

