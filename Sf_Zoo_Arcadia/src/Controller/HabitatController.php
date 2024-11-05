<?php

namespace App\Controller;

use App\Entity\Animal;
use App\Entity\Habitat;
use App\Service\HabitatService;
use App\Service\ImageManagerService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/habitat', name: 'app_api_habitat_')]
class HabitatController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatService $habitatService,
        private LoggerInterface $logger,
        private ImageManagerService $imageManager,
        private ParameterBagInterface $parameterBag,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $habitat = $this->entityManager->getRepository(Habitat::class)->findAll();

        $data = $this->serializer->serialize($habitat, 'json', ['groups' => 'habitat']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $habitat = $this->entityManager->getRepository(Habitat::class)->find($id);

        if (!$habitat) {
            return new JsonResponse(['error' => 'Habitat not found'], 404);
        }

        $data = $this->serializer->serialize($habitat, 'json', ['groups' => 'habitat']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        try {
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $imageName = $request->request->get('nom');

            $image = null;

            if ($imageFile instanceof UploadedFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                $image = $this->imageManager->createImage($imageName, $imageSubDirectory, $imageFile);
                $this->entityManager->persist($image);
            }
            $habitat = $this->habitatService->createUpdateHabitat(
                null,
                [
                    'nom' => $nom,
                    'description' => $description,
                ],
                $image
            );

            if ($image !== null) {
                $habitat->setImage($image);
                $image->setHabitat($habitat);
            }
            $this->entityManager->persist($habitat);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $habitat->getId()], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $habitat = $this->entityManager->getRepository(Habitat::class)->find($id);

            if (!$habitat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Habitat non trouvé'], 404);
            }

            $nom = $request->request->get('nom');
            $description = $request->request->get('description');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $image = $this->imageManager->handleImageUpload($imageFile, $imageSubDirectory);

            $animalIds = $request->request->all('animals');

            if (!empty($animalIds)) {
                $animals = $this->entityManager->getRepository(Animal::class)->findBy(['id' => $animalIds]);

                foreach ($animals as $animal) {
                    $animal->setHabitat($habitat);
                    $this->entityManager->persist($animal);
                }
            }

            $habitat = $this->habitatService->createUpdateHabitat($habitat, [
                'nom' => $nom,
                'description' => $description,
            ], $image);

            $this->entityManager->persist($habitat);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $habitat->getId()], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteService(int $id): JsonResponse
    {
        try {
            $habitat = $this->entityManager->getRepository(Habitat::class)->find($id);

            if (!$habitat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Habitat non trouvé'], 404);
            }

            $currentImage = $habitat->getImage();
            if ($currentImage) {
                $habitat->setImage(null);
                $this->entityManager->persist($habitat);
                $this->entityManager->flush();

                $this->imageManager->deleteImage($currentImage->getId());
                $this->entityManager->remove($currentImage);
            }
            $this->entityManager->remove($habitat);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Service supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }
}
