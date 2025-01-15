<?php

namespace App\Controller;

use App\Document\AnimalVisite;
use App\Entity\Animal;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AnimalVisiteController extends AbstractController
{
    #[Route('/api/animalVisite/{id}/{nom}', name: '_app_api_animalVisite_', methods: ['POST'])]
    public function incrementAnimalVisit(string $id, string $nom, DocumentManager $documentManager): JsonResponse
    {
        $animalVisite = $documentManager->getRepository(AnimalVisite::class)->findOneBy(['animalId' => (int) $id]);

        if (!$animalVisite) {
            $animalVisite = new AnimalVisite();
            $animalVisite->setAnimalId((int) $id);
            $animalVisite->setVisites(1);
            $animalVisite->setNom($nom);
        } else {
            $animalVisite->setVisites($animalVisite->getVisites() + 1);
            if ($animalVisite->getNom() !== $nom) {
                $animalVisite->setNom($nom);
            }
        }

        $documentManager->persist($animalVisite);
        $documentManager->flush();

        return $this->json([
            'message' => "Visite incrémentée pour l'animal $id",
            'nom' => $animalVisite->getNom(),
            'visites' => $animalVisite->getVisites(),
        ]);
    }

    // #[Route('/api/reporting', methods: ['GET'])]
    // public function getPopularAnimals(DocumentManager $documentManager)
    // {
    //     $repository = $documentManager->getRepository(AnimalVisite::class);
    //     $visites = $repository->findBy([], ['visites' => 'DESC']);

    //     $stats = array_map(fn ($visite) => [
    //         'animalId' => $visite->getAnimalId(),
    //         'nom' => $visite->getNom() ?: 'Nom inconnu',
    //         'visites' => $visite->getVisites(),
    //     ], $visites);

    //     return $this->json($stats);
    // }

    #[Route('/api/reporting', methods: ['GET'])]
    public function getPopularAnimals(DocumentManager $documentManager, EntityManagerInterface $entityManager)
    {
        // Étape 1 : Obtenez les animaux les plus populaires depuis MongoDB
        $repository = $documentManager->getRepository(AnimalVisite::class);
        $popularAnimals = $repository->findBy([], ['visites' => 'DESC']);

        // Étape 2 : Préparez un tableau des IDs d'animaux pour obtenir leurs détails depuis MySQL
        $animalIds = array_map(fn ($animal) => $animal->getAnimalId(), $popularAnimals);

        // Étape 3 : Récupérez les données des animaux depuis MySQL
        $animalRepository = $entityManager->getRepository(Animal::class);
        $animalDetails = $animalRepository->findBy(['id' => $animalIds]);

        // Étape 4 : Associez les informations de visites avec les détails d'animaux
        $data = [];
        foreach ($popularAnimals as $animalVisit) {
            $animalDetail = array_filter($animalDetails, fn ($a) => $a->getId() === $animalVisit->getAnimalId());
            $animalDetail = reset($animalDetail); // Récupère le premier élément correspondant

            $imagePath = $animalDetail->getImage()->getImagePath();
            $imagePath = strpos($imagePath, '/uploads/images/animals/') === 0 ? $imagePath : '/uploads/images/animals/'.$imagePath;
            if ($animalDetail) {
                $data[] = [
                    'id' => $animalVisit->getAnimalId(),
                    'nom' => $animalDetail->getNom(),
                    'visites' => $animalVisit->getVisites(),
                    'imagePath' => $imagePath,
                ];
            }
        }

        return new JsonResponse($data);
    }
}
