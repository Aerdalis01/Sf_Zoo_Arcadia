<?php

namespace App\Service;

use App\Entity\Habitat;
use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class HabitatService
{
    public function __construct(private EntityManagerInterface $entityManager, private ImageManagerService $imageManager, private ParameterBagInterface $parameterBag)
    {
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
                // Dissociation de l'image
                $currentImage->setHabitat(null);
                $this->entityManager->flush();

                // Suppression de l'image
                $imagePath = $currentImage->getImagePath();
                $filePath = $this->parameterBag->get('kernel.project_dir').'/public'.$imagePath;
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $this->imageManager->deleteImage($currentImage->getId());
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
        if ($entity instanceof Habitat) {
            foreach ($entity->getAnimals() as $animal) {
                $this->$entity->removeAnimal($animal);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}
