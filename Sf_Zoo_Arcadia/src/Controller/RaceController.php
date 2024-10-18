<?php

namespace App\Controller;

use App\Entity\Race;
use App\Service\RaceService;
use App\Repository\RaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/race', name: '_app_api_race_')]
class RaceController extends AbstractController
{
    public function __construct(
      private EntityManagerInterface $entityManager,
      private RaceService $raceService)
    {
    }


    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $races = $this->entityManager->getRepository(Race::class)->findAll();
    
        return new JsonResponse($races, 200, []);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function showRace(int $id, RaceRepository $raceRepository): JsonResponse
    {
        $race = $raceRepository->find($id);
        if (!$race) {
            return $this->json(['error' => 'Race not found'], Response::HTTP_NOT_FOUND);
        }
        return new JsonResponse($race, 200, []); 
    }


    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
          $nom = $request->request->get('nom');

          $race = $this->raceService->createOrUpdateRace(null, [
            'nom' => $nom,
          ]);
        $entityManager->persist($race);
        $entityManager->flush();
    
        return new JsonResponse(['status' => 'success', 'id' => $race->getId()], 201);

        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
    }
  }


    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
      try {
        $race = $this->entityManager->getRepository(Race::class)->find($id);

        if (!$race) {
            return new JsonResponse(['error' => 'Race not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $nom = $request->request->get('nom');
        $race = $this->raceService->createOrUpdateRace(null, [
          'nom' => $nom,
        ]);
        
        $this->entityManager->persist($race);
        $this->entityManager->flush();
    
        return new JsonResponse(['status' => 'success', 'id' => $race->getId()], 200);
    
      } catch (\Exception $e) {
          return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
      }
  }


    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Race $race): Response
    {
      if (count($race->getAnimals()) > 0) {
        return new JsonResponse(['error' => 'Impossible de supprimer cette race car elle est associée à des animaux'], 400);
    }

    $this->entityManager->remove($race);
    $this->entityManager->flush();

    return new JsonResponse(null, 204);
    }
}
