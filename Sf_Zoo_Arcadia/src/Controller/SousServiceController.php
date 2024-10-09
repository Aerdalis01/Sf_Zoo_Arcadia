<?php

namespace App\Controller;

use App\Entity\SousService;
use App\Repository\SousServiceRepository;
use App\Service\ImageManagerService;
use App\Service\SousServiceService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/sousService', name: '_app_api_sous_service_')]
class SousServiceController extends AbstractController
{
    public function __construct(
        private SousServiceService $sousServiceService,
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManagerService
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $sousService = $entityManager->getRepository(SousService::class)->findAll();
        $data = $serializer->serialize($sousService, 'json', ['groups' => 'Sous_service_basic']);
        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $sousService = $entityManager->getRepository(SousService::class)->find($id);
        $data = $serializer->serialize($sousService, 'json', ['groups' => 'sous_services_basic']);
        return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createSousService(Request $request, ImageManagerService $imageManagerService): JsonResponse
    {
        try {
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');
            $menu = $request->request->get('menu');
            $idService = $request->request->get('idService');

            $imageFiles = [
                'file1' => $request->files->get('file1'),
                'file2' => $request->files->get('file2'),
                ];
            $file1Name = $request->request->get('file1_name');
            $file1SubDirectory = $request->request->get('file1_sub_directory');
            $file2Name = $request->request->get('file2_name');
            $file2SubDirectory = $request->request->get('file2_sub_directory'); 

            if (!$nom || !$description  || !$idService) {
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
            // Créer ou mettre à jour le sous-service avec le service sousServiceService
            $sousService = $this->sousServiceService->createOrUpdateSousService(null, [
                'nom' => $nom,
                'description' => $description,
                'menu' => $menu,
                'idService' => $idService
            ], $image);
            foreach ($images as $image) {
                $sousService->addImage($image);
                $image->setSousService($sousService);
            }
            $this->entityManager->persist($sousService);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'success', 'id' => $sousService->getId()], 201);

        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }

    // #[Route('/{id}', name: 'update', methods: ['PUT'])]
    // public function updateService(int $id,Request $request): JsonResponse
    // {
    //     $data = json_decode($request->getContent(), true);

    //     $sousService = $this->entityManager->getRepository(SousService::class)->find($id);

    //     if (!$sousService) {
    //         $service = $this->entityManager->getRepository(Services::class)->find($id);
    //         if (!$service) {
    //             return new JsonResponse(['status' => 'error', 'message' => 'Service ou SousService non trouvé'], 404);
    //         }
    //     }
    //     try {
    //         if ($sousService) {

    //             $this->sousServiceService->createOrUpdateSousService($sousService, $data, $image);
    //             return new JsonResponse(['status' => 'success', 'id' => $sousService->getId()], 200);
    //         } else {

    //             $this->sousServiceService->createOrUpdateSousService($service, $data, $image);
    //             return new JsonResponse(['status' => 'success', 'id' => $service->getId()], 200);
    //         }

    //     } catch (\Exception $e) {
    //         return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
    //     }
    // }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, SousServiceRepository $sousServiceRepository): Response
    {
        $sousService = $sousServiceRepository->find($id);

        if (!$sousService) {
            return $this->json(['error' => 'Image not found'], Response::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($sousService);
        $this->entityManager->flush();

        return $this->json(['message' => 'Sous service supprimée avec succès'], Response::HTTP_OK);
    }
}
