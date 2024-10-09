<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ServiceService
{
    public function __construct(private EntityManagerInterface $entityManager, private ImageManagerService $imageManager, private RequestStack $requestStack)
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
        $removeImage = $request->request->get('removeImage');
        if ($removeImage === 'true') {
            $image = $entity->getImage();
            if ($image !== null) {
                $entity->removeImage();
                $this->entityManager->remove($image);
            }
        }
        if ($image !== null) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
            }
            $entity->setImage($image);
        }
        $request = $this->requestStack->getCurrentRequest();
        $removeSousServices = $request->request->get('removeSousServices');  
        
        if ($removeSousServices === 'true') {
            foreach ($entity->getSousService() as $sousService) {
                // Parcourir chaque image associée au sous-service
                foreach ($sousService->getImage() as $image) {
                    $sousService->removeImage($image);  // Supprime l'association de l'image avec le sous-service
                    $this->entityManager->remove($image);  // Supprime l'image de la base de données
                }
        
                // Supprimer le sous-service lui-même
                $entity->removeSousService($sousService);  // Dissocie le sous-service du service
                $this->entityManager->remove($sousService);  // Supprime le sous-service de la base de données
            }
        
        }
        $this->entityManager->persist($entity);
        return $entity;

    }

    public function deleteService(object $entity): void
    {
        // Suppression des images associées
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        // Si c'est un Service, supprimer ses SousServices
        if ($entity instanceof Service) {
            foreach ($entity->getSousService() as $sousService) {
                $this->deleteService($sousService);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }

}
