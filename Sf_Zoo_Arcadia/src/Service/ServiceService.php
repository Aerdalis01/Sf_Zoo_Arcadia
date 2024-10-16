<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ServiceService
{
    public function __construct(private EntityManagerInterface $entityManager, private ImageManagerService $imageManager, private RequestStack $requestStack, private ParameterBagInterface $parameterBag)
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

            $entity->removeImage(); // Supprimer l'association entre l'image et le service
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
    
                $entity->removeImage(); // Supprimer l'association de l'ancienne image
                $this->entityManager->remove($currentImage); // Supprimer l'entité image de la base de données
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
            // On flush ici après suppression des sous-services et images
            $this->entityManager->flush();
        }
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
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
