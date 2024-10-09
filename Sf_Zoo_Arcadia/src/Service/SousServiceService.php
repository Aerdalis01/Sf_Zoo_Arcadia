<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use App\Entity\SousService;
use Doctrine\ORM\EntityManagerInterface;



class SousServiceService
{
    public function __construct(private EntityManagerInterface $entityManager, private ImageManagerService $imageManager)
    {}

    public function createOrUpdateSousService(?SousService $entity, array $data, $image): SousService
    {
        if (!$entity) {
            $entity = new SousService();
        }

        $entity->setNom($data['nom'] ?? $entity->getNom());
        $entity->setDescription($data['description'] ?? $entity->getDescription());
        if (isset($data['menu'])) {
            $entity->setMenu((bool)$data['menu']);
        }    
        if (isset($data['idService']) && !empty($data['idService'])) {
            $service = $this->entityManager->getRepository(Service::class)->find($data['idService']);
            if (!$service) {
                throw new \InvalidArgumentException('Service non trouvé pour l\'ID donné.');
            }
            $entity->setService($service);
        } else {
            throw new \InvalidArgumentException('L\'ID du service est requis pour associer le sous-service.');
        }
        
            if (!$entity->getCreatedAt()) {
                $entity->setCreatedAt(new \DateTimeImmutable());
            }
            $entity->setUpdatedAt(new \DateTimeImmutable());
    
            // Initialisation des images si nécessaire
            if ($image !== null) {
                if (!$image instanceof Image) {
                    throw new \InvalidArgumentException('L\'image fournie n\'est pas une instance de Image');
                $entity->setImage($image); 
            }
            $this->entityManager->persist($entity);
            
        }
            return $entity;
        }

    public function deleteSousService(object $entity): void
    {
        // Suppression des images associées
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        // Si c'est un Service, supprimer ses SousServices
        if ($entity instanceof Service) {
            foreach ($entity->getSousService() as $sousService) {
                $this->deleteSousService($sousService);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}
