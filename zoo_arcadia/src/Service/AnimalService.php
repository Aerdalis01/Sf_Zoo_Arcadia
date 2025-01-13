<?php

namespace App\Service;

use App\Entity\Animal;
use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class AnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManager,
        private RequestStack $requestStack,
        private ParameterBagInterface $parameterBag
    ) {
    }


    public function createOrUpdateAnimal(?Animal $entity, array $data, ?Image $image): object
    {

        if (!$entity) {
            $entity = new Animal();
        }
        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setRace($data['race'] ?? $entity->getRace());
        $entity->setHabitat($data['habitat'] ?? $entity->getHabitat());
    
        if ($image !== null) {
            $currentImage = $entity->getImage();
    
            // S'il y a déjà une image associée, la supprimer avant d'ajouter la nouvelle
            if ($currentImage !== null) {
                $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $currentImage->getImagePath();
                if (file_exists($filePath)) {
                    unlink($filePath); // Supprimer physiquement l'image du répertoire
                }
                $this->entityManager->remove($currentImage); // Supprimer l'entité Image de la base de données
            }
    
            // Associer la nouvelle image à l'animal
            $entity->setImage($image);
            $image->setAnimal($entity);
            $this->entityManager->persist($image);
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return $entity;
    }

    public function deleteAnimal(object $entity): void
    {
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }



}
