<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Habitat;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class HabitatService
{
    private EntityManagerInterface $entityManager;
    private ImageManagerService $imageManager;
    private ParameterBagInterface $parameterBag;

    public function __construct(EntityManagerInterface $entityManager, ImageManagerService $imageManager)
    {
        $this->entityManager = $entityManager;
        $this->imageManager = $imageManager;
    }

    public function createUpdateHabitat(?Habitat $entity, array $data, ?Image $image): object
    {
        if (!$entity) {
            $entity = new Habitat();
        }
        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setDescription($data['description'] ?? $entity->getDescription());

        if ($image !== null) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
            }

            $currentImage = $entity->getImage();
            if ($currentImage !== null) {
                $imagePath = $currentImage->getImagePath();
                $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $imagePath;
                if (file_exists($filePath)) {
                    unlink($filePath); 
                }
                $this->imageManager->deleteImage($imagePath);
                $this->entityManager->remove($currentImage);   
            }

            $entity->setImage($image);
            $image->setHabitat($entity);
            $this->entityManager->persist($image);
        }
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
    
        return $entity;
    }

    public function deleteHabitat(object $entity): void
    {
        
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        // Si c'est un Service, supprimer ses SousServices
        if ($entity instanceof habitat) {
            foreach ($entity->getAnimal() as $animal) {
                $this->$entity->removeAnimal($animal);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
    
}
