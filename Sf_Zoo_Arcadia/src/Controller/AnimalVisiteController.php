<?php

namespace App\Controller;

use App\Document\AnimalVisite;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AnimalVisiteController extends AbstractController
{
    #[Route('/api/animalVisite/{id}/{nom}', name: '_app_api_animalVisite_', methods: ['POST'])]
    public function incrementAnimalVisit(string $id, string $nom, DocumentManager $documentManager): JsonResponse
    {
        $animalVisite = $documentManager->getRepository(AnimalVisite::class)->findOneBy(['animalId' => (int) $id]);

        // Si aucun document n'est trouvé, en créer un nouveau
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

    #[Route('/api/reporting', methods: ['GET'])]
    public function getPopularAnimals(DocumentManager $documentManager)
    {
        $repository = $documentManager->getRepository(AnimalVisite::class);
        $visites = $repository->findBy([], ['visites' => 'DESC']);

        $stats = array_map(fn ($visite) => [
            'animalId' => $visite->getAnimalId(),
            'nom' => $visite->getNom() ?: 'Nom inconnu',
            'visites' => $visite->getVisites(),
        ], $visites);

        return $this->json($stats);
    }
}
