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
        private ParameterBagInterface $parameterBag)
    {}
    

    public function createOrUpdateService(?Animal $entity, array $data, ?Image $image): object
    {

        if(!$entity) {$entity = new Animal();
        }
        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setRace($date['race'] ?? $entity->getRace());
        $entity->sethabitat($date['habitat'] ?? $entity->getHabitat());

        $request = $this->requestStack->getCurrentRequest();

        if ($request->request->get('removeImage') === 'true') {
        $currentImage = $entity->getImage();
        if ($currentImage !== null) {
            
            $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $currentImage->getImagePath();
            if (file_exists($filePath)) {
                unlink($filePath); 
            }

            $entity->$this->imageManger->removeImage($currentImage); // Supprimer l'association entre l'image et le service
            $this->entityManager->remove($currentImage); // Supprimer l'entité image de la base de données
        }
    }
        if ($image !== null) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
            }

            // Si le service a déjà une image, on la remplace par la nouvelle
            $currentImage = $entity->getImage();
            if ($currentImage !== null) {
                // Supprimer l'ancienne image du disque
                $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $currentImage->getImagePath();
                if (file_exists($filePath)) {
                    unlink($filePath); // Supprimer le fichier du disque
                }
    
                $entity->$this->imageManger->removeImage($currentImage); 
                $this->entityManager->remove($currentImage); 
            }
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
