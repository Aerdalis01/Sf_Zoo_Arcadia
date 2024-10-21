<?php

namespace App\Service;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;


class ImageManagerService
{


    public function __construct(private string $imageDirectory,private EntityManagerInterface $entityManager, private SluggerInterface $sluggerInterface, private ParameterBagInterface $parameterBag, private LoggerInterface $loggerInterface )
    {}

    public function createImage( ?string $nom, ?string $imageSubDirectory, UploadedFile $imageFile): Image
    {
        if ($imageFile instanceof UploadedFile) { 
            $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->sluggerInterface->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();
            
            $uploadDirectory = $this->parameterBag->get('images_directory') . '/' . $imageSubDirectory;
            
        } else {
            throw new \InvalidArgumentException('Le fichier doit être une instance de UploadedFile.');
        }
        
        if (!is_dir($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }

        try {
            
            $imageFile->move($uploadDirectory, $newFilename);
        } catch (FileException $e) {
            $this->loggerInterface->error($e->getMessage());
            throw new \Exception("Une erreur est survenue lors du téléchargement de l'image.");
        }

        // Stocker le chemin du fichier dans l'entité Image
        $image = new Image();
        $image->setNom($safeFilename);
        $image->setImagePath($imageSubDirectory . '/' . $newFilename);
        $image->setImageSubDirectory($imageSubDirectory);

        $this->entityManager->persist($image);
        $this->entityManager->flush(); 

        $this->loggerInterface->info(sprintf('Image téléchargée avec succès : %s', $newFilename));

        return $image;
    }

    

    public function deleteImage(int $imageId): void
    {$image = $this->entityManager->getRepository(Image::class)->find($imageId);
    
        if ($image) {
            $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $image->getImagePath();
            if (file_exists($filePath)) {
                unlink($filePath);
            }
    
            $this->entityManager->remove($image);
            $this->entityManager->flush();
            
            $this->loggerInterface->info("Image supprimée avec succès via l'ID : " . $imageId);
        } else {
            $this->loggerInterface->error("Image non trouvée pour l'ID : " . $imageId);
        }
    }

    public function handleImageUpload(?UploadedFile $imageFile, ?string $subDirectory): ?Image
    {
        if ($imageFile instanceof UploadedFile) {
            $imageName = $this->generateImageName($imageFile); // Logique déplacée dans le service
            return $this->createImage($imageName, $subDirectory, $imageFile);
        }
        return null;
    }
    private function generateImageName(UploadedFile $imageFile): string
    {
        $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->sluggerInterface->slug($originalFilename);
        return $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();
    }
}
