<?php

namespace App\Controller;

use App\Entity\Habitat;
use Psr\Log\LoggerInterface;
use App\Form\HabitatType;
use App\Service\HabitatService;
use App\Repository\HabitatRepository;
use App\Service\ImageManagerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        $habitat = $this->entityManager->getRepository(Habitat::class)->findAll();
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
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }

    #[Route('/{id}', name: 'edit', methods: ['POST'])]
    public function edit(int $id, Request $request): JsonResponse
    {
        try {
            $habitat = $this->entityManager->getRepository(Habitat::class)->find($id);

            if (!$habitat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
            }

            
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');

            
            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');

            $image = null;
            if ($imageFile instanceof UploadedFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);
                $image = $this->imageManager->createImage($imageName, $imageSubDirectory, $imageFile);
                $this->entityManager->persist($image);
            }

            $habitat = $this->habitatService->createUpdateHabitat($habitat, [
                'nom' => $nom,
                'description' => $description,
            ], $image);

            $this->entityManager->persist($habitat);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $habitat->getId()], 200);

        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }



    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteService(int $id): JsonResponse
    {
        $habitat = $this->entityManager->getRepository(Habitat::class)->find($id);

        if (!$habitat) {
            return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
        }
        try {

            foreach ($habitat->getAnimal() as $animal) {

                foreach ($animal->getImage() as $image) {
                    $this->imageManager->deleteImage($image->getImagePath());
                    $this->entityManager->remove($image);
                }

                $this->entityManager->remove($animal);
            }

            // Supprimer l'image associée au habitat
            $currentImage = $habitat->getImage();
            if ($currentImage !== null) {
                $this->imageManager->deleteImage($currentImage->getImagePath());
                $this->entityManager->remove($currentImage);
            }

            // Supprimer le habitat
            $this->entityManager->remove($habitat);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Service supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : ' . $e->getMessage()], 500);
        }
    }
}
