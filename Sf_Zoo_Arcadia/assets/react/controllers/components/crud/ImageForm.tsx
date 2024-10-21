import React from 'react';
import  {useState, useEffect} from 'react';

export interface ImageFormProps {
  serviceName: string;
  onImageSelect: (file: File | null) =>void;
  resetImage: boolean;
}

export const ImageForm: React.FC<ImageFormProps> = ({ serviceName, onImageSelect, resetImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onImageSelect(file);
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
          setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
  } else {
      onImageSelect(null);
      setImagePreview(null);
  }
};
useEffect(() => {
  if (resetImage) {
    setImagePreview(null);
  }
}, [resetImage]);

  return (
    
      <div>
        <label htmlFor="image">Selectionnez une image:</label>
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

