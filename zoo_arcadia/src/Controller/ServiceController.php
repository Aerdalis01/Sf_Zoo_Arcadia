<?php

namespace App\Controller;

use App\Entity\Service;
use App\Service\ImageManagerService;
use App\Service\JwtService;
use App\Service\ServiceService;
use App\Service\TokenValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/service', name: '_app_api_service_')]
class ServiceController extends AbstractController
{
    public function __construct(
        private ServiceService $serviceService,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger,
        private ImageManagerService $imageManagerService,
        private ParameterBagInterface $parameterBag,
        private JwtService $jwtService,
        private TokenValidatorService $tokenValidator)
    {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $services = $entityManager->getRepository(Service::class)->findAllWithSousServices();

        $data = $serializer->serialize($services, 'json', ['groups' => ['service_basic', 'sousService_basic']]);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $service = $entityManager->getRepository(Service::class)->find($id);
        if (!$service) {
            return new JsonResponse(['error' => 'Service not found'], 404);
        }

        $data = $serializer->serialize($service, 'json', ['groups' => 'service_basic']);

        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createService(Request $request, ImageManagerService $imageManagerService): JsonResponse
    {
        $this->tokenValidator->validateTokenAndRoles(
            $request->headers->get('Authorization'),
            ['ROLE_ADMIN']
        );
        try {
            $nom = $request->get('nom');
            $description = $request->get('description');
            $titre = $request->get('titre');
            $horaireTexte = $request->get('horaire');
            $carteZoo = $request->get('carteZoo');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->get('image_sub_directory');
            $imageName = $request->get('nom');

            if (!$nom) {
                return new JsonResponse(['status' => 'error', 'message' => 'Paramètres nom ou type manquants.'], 400);
            }
            $image = null;

            if ($imageFile instanceof UploadedFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                $image = $imageManagerService->createImage($imageName, $imageSubDirectory, $imageFile);
                $this->entityManager->persist($image);
            }

            $service = $this->serviceService->createOrUpdateService(null, [
                'nom' => $nom,
                'description' => $description,
                'titre' => $titre,
                'horaire' => $horaireTexte,
                'carteZoo' => $carteZoo,
            ], $image, $request);

            if ($image !== null) {
                $service->setImage($image);
                $image->setService($service);
            }
            $this->entityManager->persist($service);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $service->getId()], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function updateService(int $id, Request $request): JsonResponse
    {
        $this->tokenValidator->validateTokenAndRoles(
            $request->headers->get('Authorization'),
            ['ROLE_ADMIN', 'ROLE_EMPLOYE']
        );
        try {
            $service = $this->entityManager->getRepository(Service::class)->find($id);
            if (!$service) {
                return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
            }

            $nom = $request->get('nom');
            $description = $request->get('description');
            $titre = $request->get('titre');
            $horaireTexte = $request->get('horaire');

            $carteZoo = $request->get('carteZoo');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $image = $this->imageManagerService->handleImageUpload($imageFile, $imageSubDirectory);

            $service = $this->serviceService->createOrUpdateService($service, [
                'nom' => $nom,
                'description' => $description,
                'titre' => $titre,
                'horaire' => $horaireTexte,
                'carteZoo' => $carteZoo,
            ], $image, $request);

            $this->entityManager->persist($service);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $service->getId()], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteService(int $id): JsonResponse
    {
        $service = $this->entityManager->getRepository(Service::class)->find($id);

        if (!$service) {
            return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
        }

        try {
            foreach ($service->getSousServices() as $sousService) {
                foreach ($sousService->getImage() as $image) {
                    $this->imageManagerService->deleteImage($image->getId());
                    $this->entityManager->remove($image);
                }

                $this->entityManager->remove($sousService);
            }

            // Supprimer l'image associée au service
            $currentImage = $service->getImage();
            if ($currentImage !== null) {
                $this->imageManagerService->deleteImage($currentImage->getId());
                $this->entityManager->remove($currentImage);
            }

            // Supprimer le service
            $this->entityManager->remove($service);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Service supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }
}
