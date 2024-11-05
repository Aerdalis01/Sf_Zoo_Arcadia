<?php

namespace App\Controller;

use App\Entity\Animal;
use App\Entity\Habitat;
use App\Entity\Race;
use App\Service\AnimalService;
use App\Service\ImageManagerService;
use App\Service\RaceService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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
        private SerializerInterface $serializer,
        private RaceService $raceService
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $query = $entityManager->createQueryBuilder('a')
            ->select('a', 'h', 'r')
            ->from(Animal::class, 'a')
            ->leftJoin('a.habitat', 'h')
            ->leftJoin('a.race', 'r')
            ->getQuery();

        $animals = $query->getArrayResult();

        $data = $serializer->serialize($animals, 'json', ['groups' => 'animal']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $query = $entityManager->createQueryBuilder('a')
            ->select('a', 'h', 'r')
            ->from(Animal::class, 'a')
            ->leftJoin('a.habitat', 'h')
            ->leftJoin('a.race', 'r')
            ->where('a.id = :id')
            ->setParameter('id', $id)
            ->getQuery();

        $animal = $query->getArrayResult();

        if (!$animal) {
            return new JsonResponse(['error' => 'Animal not found'], 404);
        }

        $data = $serializer->serialize($animal, 'json', ['groups' => 'animal']);

        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        try {
            $nom = $request->request->get('nom');
            $idHabitat = $request->request->get('idHabitat');
            $idRace = $request->request->get('idRace');
            $nomRace = $request->request->get('nomRace');

            if (!$nom || !$idHabitat || (!$idRace && !$nomRace)) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Tous les champs (nom, habitat, race) sont requis',
                ], Response::HTTP_BAD_REQUEST);
            }

            $habitat = $entityManager->getRepository(Habitat::class)->find($idHabitat);
            if (!$habitat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Habitat non trouvé'], 400);
            }

            $race = null;
            if ($idRace) {
                $race = $entityManager->getRepository(Race::class)->find($idRace);
                if (!$race) {
                    return new JsonResponse([
                        'status' => 'error',
                        'message' => 'Race non trouvée',
                    ], Response::HTTP_BAD_REQUEST);
                }
            } elseif ($nomRace) {
                $race = $this->raceService->createOrUpdateRace(null, ['nom' => $nomRace]);
            }
            $animal = new Animal();
            $animal->setNom($nom);
            $animal->setHabitat($habitat);
            $animal->setRace($race);

            $imageFile = $request->files->get('file');
            if ($imageFile instanceof UploadedFile) {
                $imageSubDirectory = $request->request->get('image_sub_directory', '/services');
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                $image = $this->imageManager->createImage($imageName, $imageSubDirectory, $imageFile);
                $animal->setImage($image);
            }

            $this->entityManager->persist($animal);
            $this->entityManager->flush();

            return new JsonResponse([
                'status' => 'success',
                'message' => 'Animal créé avec succès',
                'animalId' => $animal->getId(),
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur : '.$e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $animal = $this->entityManager->getRepository(Animal::class)->find($id);
            if (!$animal) {
                return new JsonResponse(['status' => 'error', 'message' => 'Animal non trouvé'], 404);
            }
            $nom = $request->request->get('nom');
            $idHabitat = $request->request->get('idHabitat');
            $idRace = $request->request->get('idRace');
            $nomRace = $request->request->get('nomRace');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $image = $this->imageManager->handleImageUpload($imageFile, $imageSubDirectory);

            $race = $animal->getRace();
            if (!$race) {
                return new JsonResponse(['status' => 'error', 'message' => 'Race non trouvée'], 404);
            }

            if ($nomRace && $nomRace !== $race->getNom()) {
                $race->setNom($nomRace);
                $this->entityManager->persist($race);

                $animals = $this->entityManager->getRepository(Animal::class)->findBy(['race' => $race]);
                foreach ($animals as $otherAnimal) {
                    $otherAnimal->setRace($race);
                    $this->entityManager->persist($otherAnimal);
                }
            }

            $animal = $this->animalService->createOrUpdateAnimal($animal, [
                'nom' => $nom,
                'idHabitat' => $idHabitat,
                'race' => $race,
            ], $image);

            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $animal->getId()], 200);
        } catch (\Exception $e) {
            // Logger l'erreur pour un suivi détaillé
            $this->logger->error('Erreur lors de la mise à jour de l\'animal : '.$e->getMessage());

            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteService(int $id): JsonResponse
    {
        try {
            $animal = $this->entityManager->getRepository(Animal::class)->find($id);
            $currentImage = $animal->getImage();
            if ($currentImage !== null) {
                $this->imageManager->deleteImage($currentImage->getId());
                $this->entityManager->remove($currentImage);
            }

            $this->entityManager->remove($animal);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Service supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }
}
