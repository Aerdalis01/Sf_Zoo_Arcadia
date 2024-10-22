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
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/race', name: '_app_api_race_')]
class RaceController extends AbstractController
{
    public function __construct(
      private EntityManagerInterface $entityManager,
      private RaceService $raceService)
    {
    }


    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(SerializerInterface $serializer): JsonResponse
    {
        $races = $this->entityManager->getRepository(Race::class)->findAll();
        $data = $serializer->serialize($races, 'json', ['groups' => 'race']);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function showRace(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $race = $entityManager->getRepository(Race::class)->find($id);
        if (!$race) {
          return new JsonResponse(['error' => 'Service not found'], 404);
        }
        
        $data = $serializer->serialize($race, 'json', ['groups' => 'race']);

        
        return new JsonResponse($race->toArray());
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


    #[Route('/{id}', name: 'update', methods: ['POST'])]
    public function update(int $id, Request $request): JsonResponse
    {
      try {
        $race = $this->entityManager->getRepository(Race::class)->find($id);

        if (!$race) {
            return new JsonResponse(['error' => 'Race not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $nom = $request->request->get('nom');
        if ($nom) {
          $race->setNom($nom);
          foreach ($race->getAnimals() as $animal) {
              $animal->setRace($race);
          }
        }
        
        $this->entityManager->persist($race);
        $this->entityManager->flush();
    
        return new JsonResponse(['status' => 'success', 'id' => $race->getId()], 200);
    
      } catch (\Exception $e) {
          return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
      }
  }


    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
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
