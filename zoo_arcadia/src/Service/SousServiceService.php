<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Service;
use App\Entity\SousService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\String\Slugger\SluggerInterface;

class SousServiceService
{
    public function __construct(private EntityManagerInterface $entityManager, private ImageManagerService $imageManager, private RequestStack $requestStack, private ParameterBagInterface $parameterBag, private SluggerInterface $slugger)
    {
    }

    public function createOrUpdateSousService(?SousService $entity, array $data): SousService
    {
        // Récupération du fichier envoyé
        $request = $this->requestStack->getCurrentRequest();
        $image1 = $request->files->get('image1');
        $image2 = $request->files->get('image2'); // Si vous avez une deuxième image

        if (!$entity) {
            $entity = new SousService();
        }
        $idService = $data['idService'] ?? null;
        if (!$idService) {
            throw new \Exception("L'ID du service est manquant");
        }
        $service = $this->entityManager->getRepository(Service::class)->find($idService);

        if (!$service) {
            throw new \Exception("Service non trouvé pour l'ID donné");
        }
        $entity->setService($service);

        // Associe le service au sous-service
        $entity->setService($service);
        $entity->setNom($data['nom']);
        $entity->setDescription($data['description'] ?? $entity->getDescription());
        $entity->setMenu(isset($data['menu']) ? (bool) $data['menu'] : $entity->getMenu());
        // Suppression des images existantes avant d'ajouter les nouvelles
        foreach ($entity->getImage() as $existingImage) {
            // Supprimer le fichier physique
            $existingImagePath = $this->parameterBag->get('kernel.project_dir') . '/public' . $existingImage->getImagePath();
            if (file_exists($existingImagePath)) {
                unlink($existingImagePath); // Supprimer le fichier du système de fichiers
            }

            // Supprimer l'entité Image de l'entité SousService
            $entity->removeImage($existingImage);
            $this->entityManager->remove($existingImage); // Supprimer l'entité Image de la base de données
        }

        if ($image1 instanceof UploadedFile) {
            $originalFilename = pathinfo($image1->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $timestamp = time();
            $extension = $image1->guessExtension();

            // Nom utilisé pour le fichier physique
            $imageName1 = sprintf('%s-%s.%s', $safeFilename, $timestamp, $extension);

            // Répertoire de destination
            $imageSubDirectory = $data['image1_sub_directory'] ?? 'services';
            $destination = $this->parameterBag->get('kernel.project_dir') . '/public/uploads/' . $imageSubDirectory;

            // Créer le répertoire si nécessaire
            if (!is_dir($destination)) {
                mkdir($destination, 0777, true);
            }

            try {
                // Déplacement de l'image
                $image1->move($destination, $imageName1);

                // Créer une nouvelle entité Image avec le nom sans timestamp
                $imageEntity = new Image();
                $imageEntity->setNom($imageName1);  // Stocker le nom sans timestamp
                $imageEntity->setImagePath('/' .$imageSubDirectory . '/' . $imageName1);
                $imageEntity->setImageSubDirectory('/' .$imageSubDirectory);
                $entity->addImage($imageEntity);

                // Persister l'entité Image
                $this->entityManager->persist($imageEntity);
            } catch (FileException $e) {
                throw new \Exception("Erreur lors du téléchargement de l'image : " . $e->getMessage());
            }
        }

        // Ajout de la deuxième image (si présente)
        if ($image2 instanceof UploadedFile) {
            $originalFilename2 = pathinfo($image2->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename2 = $this->slugger->slug($originalFilename2);
            $timestamp2 = time();
            $extension2 = $image2->guessExtension();

            // Nom utilisé pour le fichier
            $imageName2 = sprintf('%s-%s.%s', $safeFilename2, $timestamp2, $extension2);

            // Répertoire de destination
            $imageSubDirectory2 = $data['image2_sub_directory'] ?? 'services';
            $destination2 = $this->parameterBag->get('kernel.project_dir') . '/public/uploads/' . $imageSubDirectory2;

            // Créer le répertoire si nécessaire
            if (!is_dir($destination2)) {
                mkdir($destination2, 0777, true);
            }

            try {
                // Déplacer l'image vers le répertoire
                $image2->move($destination2, $imageName2);

                // Créer une nouvelle entité Image avec le nom sans timestamp
                $imageEntity2 = new Image();
                $imageEntity2->setNom($imageName2);  // Stocker le nom sans timestamp
                $imageEntity2->setImagePath('/' . $imageSubDirectory2 . '/' . $imageName2);
                $imageEntity2->setImageSubDirectory('/' . $imageSubDirectory2);
                $entity->addImage($imageEntity2);

                // Persister l'entité Image
                $this->entityManager->persist($imageEntity2);
            } catch (FileException $e) {
                throw new \Exception("Erreur lors du téléchargement de la deuxième image : " . $e->getMessage());
            }
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return $entity;
    }


    public function deleteSousService(object $entity): void
    {

        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        if ($entity instanceof Service) {
            foreach ($entity->getSousService() as $sousService) {
                $this->deleteSousService($sousService);
            }
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}
