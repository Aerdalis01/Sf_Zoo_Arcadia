<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Entity\Animal;
use App\Entity\Race;
use App\Service\ImageManagerService;
use App\Repository\RaceRepository;
use App\Repository\HabitatRepository;
use App\Service\AnimalService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/animal', name: 'app_api_animal_')]
class AnimalController extends AbstractController
{
    public function __construct(
        private AnimalService $animalService,
        private LoggerInterface $logger,
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManager,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $services = $entityManager->getRepository(Animal::class)->findAll();

        $data = $serializer->serialize($services, 'json', ['groups' => 'service_basic']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $service = $entityManager->getRepository(Animal::class)->find($id);
        if (!$service) {
            return new JsonResponse(['error' => 'Service not found'], 404);
        }

        $data = $serializer->serialize($service, 'json', ['groups' => 'service_basic']);


        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, RaceRepository $raceRepository, HabitatRepository $habitatRepository): Response
    {
        try {
            $nom = $request->request->get('nom');
            $habitatId = $request->request->get('habitat');
            $raceNom = $request->request->get('race');

            
            $habitat = $habitatRepository->find($habitatId);
            if (!$habitat) {
                return new Response('Habitat non trouvé', Response::HTTP_BAD_REQUEST);
            }

            $race = $raceRepository->findOneBy(['nom' => $raceNom]);
            if (!$race) {
                $race = new Race();
                $race->setNom($raceNom);


                $this->entityManager->persist($race);
            }
            $animal = new Animal();
            $animal->setNom($nom);
            $animal->setHabitat($habitat);
            $animal->setRace($race);


            $this->entityManager->persist($animal);
            $this->entityManager->flush();

            return new Response('Animal créé avec succès', Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Gérer les erreurs en renvoyant un message d'erreur approprié
            return new Response('Erreur : ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteService(object $entity): void
    {
        
        foreach ($entity->getImages() as $image) {
            $this->imageManager->deleteImage($image->getImagePath());
            $this->entityManager->remove($image);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}
