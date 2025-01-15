<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\SousService;
use App\Service\ImageManagerService;
use App\Service\SousServiceService;
use App\Service\TokenValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/sousService', name: '_app_api_sous_service_')]
class SousServiceController extends AbstractController
{
    public function __construct(
        private SousServiceService $sousServiceService,
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManagerService,
        private ParameterBagInterface $parameterBag,
        private TokenValidatorService $tokenValidator
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $sousService = $entityManager->getRepository(SousService::class)->findAll();
        $data = $serializer->serialize($sousService, 'json', ['groups' => 'sousService_basic']);

        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $sousService = $entityManager->getRepository(SousService::class)->find($id);
        $data = $serializer->serialize($sousService, 'json', ['groups' => 'sousService_basic']);

        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createSousService(Request $request, ImageManagerService $imageManagerService): JsonResponse
    {
        $this->tokenValidator->validateTokenAndRoles(
            $request->headers->get('Authorization'),
            ['ROLE_ADMIN']
        );

        try {
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');
            $menu = $request->request->get('menu');
            $idService = $request->request->get('idService');

            $imageFiles = [
                'file1' => $request->files->get('file1'),
                'file2' => $request->files->get('file2'),
            ];
            $imageName = $request->request->get('file1_name');
            $file1SubDirectory = $request->request->get('file1_sub_directory');
            $imageName = $request->request->get('file2_name');
            $file2SubDirectory = $request->request->get('file2_sub_directory');

            if (!$nom || !$description || !$idService) {
                return new JsonResponse(['status' => 'error', 'message' => 'Paramètres manquants.'], 400);
            }

            $images = [];
            foreach ($imageFiles as $key => $imageFile) {
                if ($imageFile instanceof UploadedFile) {
                    $imageSubDirectory = ($key === 'file1') ? $file1SubDirectory : $file2SubDirectory;

                    $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $timestamp = time();
                    $extension = $imageFile->guessExtension();
                    $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                    $image = $imageManagerService->createImage($imageName, $imageSubDirectory, $imageFile);
                    $this->entityManager->persist($image);
                    $images[$key] = $image;
                }
            }

            $sousService = $this->sousServiceService->createOrUpdateSousService(null, [
                'nom' => $nom,
                'description' => $description,
                'menu' => $menu,
                'idService' => $idService,
            ], $image);
            foreach ($images as $image) {
                $sousService->addImage($image);
                $image->setSousService($sousService);
            }
            $this->entityManager->persist($sousService);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $sousService->getId()], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/{id}', name: 'update', methods: ['POST'])]
    public function updateSousService(int $id, Request $request): JsonResponse
    {
        $this->tokenValidator->validateTokenAndRoles(
            $request->headers->get('Authorization'),
            ['ROLE_ADMIN']
        );

        $sousService = $this->entityManager->getRepository(SousService::class)->find($id);

        if (!$sousService) {
            return new JsonResponse(['status' => 'error', 'message' => 'Service ou SousService non trouvé'], 404);
        }
        try {
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');
            $menu = $request->request->get('menu');
            $idService = $request->request->get('idService');

            $file1 = $request->files->get('file1');
            $file2 = $request->files->get('file2');
            $imageSubDirectory = $request->request->get('image_sub_directory') ?? 'default_directory';

            $images = [];

            if ($file1 instanceof UploadedFile) {
                $originalFilename = pathinfo($file1->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $file1->guessExtension();
                $imageName1 = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                $images['file1'] = $file1;
                $images['imageName1'] = $imageName1;
                $images['image_sub_directory'] = $imageSubDirectory;
            }

            if ($menu && $file2 instanceof UploadedFile) {
                $originalFilename = pathinfo($file2->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $file2->guessExtension();
                $imageName2 = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                $images['file2'] = $file2;
                $images['imageName2'] = $imageName2;
                $images['file2_sub_directory'] = $imageSubDirectory;
            }

            $sousService = $this->sousServiceService->createOrUpdateSousService(
                $sousService,
                [
                    'nom' => $nom,
                    'description' => $description,
                    'menu' => $menu,
                    'idService' => $idService,
                ],
                $images
            );
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $sousService->getId()], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : '.$e->getMessage()], 500);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteSousService(int $id, Request $request): JsonResponse
    {
        $this->tokenValidator->validateTokenAndRoles(
            $request->headers->get('Authorization'),
            ['ROLE_ADMIN']
        );

        $sousService = $this->entityManager->getRepository(SousService::class)->find($id);
        if (!$sousService) {
            return new JsonResponse(['status' => 'error', 'message' => 'Sous-service non trouvé'], 404);
        }

        try {
            // Parcourir toutes les images associées au sous-service
            $images = $sousService->getImage(); // Supposons que cette méthode renvoie une collection d'images

            foreach ($images as $image) {
                $this->deleteImageFile($image->getImagePath());
                $this->entityManager->remove($image);
            }

            // Supprimer le sous-service
            $this->entityManager->remove($sousService);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Sous-service supprimé avec succès'], 200);
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyer un message d'erreur détaillé
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }

    private function deleteImageFile(string $imagePath): void
    {
        $filePath = $this->parameterBag->get('kernel.project_dir').'/public'.$imagePath;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}
