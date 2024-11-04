<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ServiceService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManager,
        private RequestStack $requestStack,
        private ParameterBagInterface $parameterBag)
    {
    }

    public function createOrUpdateService(?Service $entity, array $data, ?Image $image): object
    {
        if (!$entity) {
            $entity = new Service();
        }

        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setTitre($data['titre'] ?? $entity->getTitre());
        $entity->setDescription($data['description'] ?? $entity->getDescription());

        if (isset($data['horaire']) && is_array($data['horaire'])) {
            $entity->setHoraire(json_encode($data['horaire']));
        } else {
            $entity->setHoraire($data['horaire'] ?? $entity->getHoraire());
        }
        if (isset($data['carteZoo'])) {
            $entity->setCarteZoo((bool)$data['carteZoo']);
        }

        $request = $this->requestStack->getCurrentRequest();

        if ($request->request->get('removeImage') === 'true') {
        $currentImage = $entity->getImage();
        if ($currentImage !== null) {
            
            $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $currentImage->getImagePath();
            if (file_exists($filePath)) {
                unlink($filePath); 
            }

            $entity->removeImage(); 
            $this->entityManager->remove($currentImage); 
        }
    }
        if ($image !== null) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
            }
            
            $currentImage = $entity->getImage();
            if ($currentImage !== null) {
                // Supprimer l'ancienne image du disque
                $filePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $currentImage->getImagePath();
                if (file_exists($filePath)) {
                    unlink($filePath); 
                }
    
                $entity->removeImage(); 
                $this->entityManager->remove($currentImage); 
            }
    
            // Rattacher la nouvelle image au service
            $entity->setImage($image);
            $image->setService($entity);
            $this->entityManager->persist($image);
        }
        if ($request->request->get('removeSousServices') === 'true') {
            foreach ($entity->getSousService() as $sousService) {
                foreach ($sousService->getImage() as $image) {
                    $sousService->removeImage($image);
                    $this->entityManager->remove($image);
                }
                $entity->removeSousService($sousService);
                $this->entityManager->remove($sousService);
            }
            
            $this->entityManager->flush();
        }
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
        return $entity;

    }

    public function deleteService(object $entity): void
    {
        
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }
        
        if ($entity instanceof Service) {
            foreach ($entity->getSousService() as $sousService) {
                $this->deleteService($sousService);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }

}
