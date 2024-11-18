<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Request;

class ServiceService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManager,
        private ParameterBagInterface $parameterBag)
    {
    }

    public function createOrUpdateService(?Service $entity, array $data, ?Image $image, Request $request): object
    {
        if (!$entity) {
            $entity = new Service();
        }

        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setTitre($data['titre'] ?? $entity->getTitre());
        $entity->setDescription($data['description'] ?? $entity->getDescription());

        if (isset($data['horaire'])) {
            // Si horaire est un tableau, le convertir en chaîne JSON
            $horaireValue = is_array($data['horaire']) ? json_encode($data['horaire']) : $data['horaire'];

            // Log de débogage pour vérifier le type et la valeur de $horaireValue
            error_log('Type of $horaireValue: '.gettype($horaireValue).', Value: '.$horaireValue);

            // Assigner la valeur formatée à horaireTexte
            $entity->setHoraireTexte($horaireValue);
        } else {
            // Sinon, garder la valeur actuelle de horaireTexte
            $entity->setHoraireTexte($entity->getHoraireTexte());
        }
        if (isset($data['carteZoo'])) {
            $entity->setCarteZoo((bool) $data['carteZoo']);
        }
        if ($image !== null) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
            }

            $currentImage = $entity->getImage();
            if ($currentImage !== null) {
                // Dissociation de l'image
                $currentImage->setService(null);
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
            $image->setService($entity);
            $this->entityManager->persist($image);
        }

        if ($request->get('removeSousServices') === 'true') {
            foreach ($entity->getSousServices() as $sousService) {
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
            foreach ($entity->getSousServices() as $sousService) {
                $this->deleteService($sousService);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}
