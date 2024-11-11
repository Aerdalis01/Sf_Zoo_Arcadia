<?php

namespace App\Controller;

use App\Entity\Service;
use App\Service\ImageManagerService;
use App\Service\ServiceService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
        private ParameterBagInterface $parameterBag)
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
        try {
            $nom = $request->get('nom');
            $description = $request->get('description');
            $titre = $request->get('titre');
            $horaire = json_decode($request->get('horaire'), true);
            $carteZoo = $request->get('carteZoo');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->get('image_sub_directory');
            $imageName = $request->get('nom');

            if (!$nom) {
                return new JsonResponse(['status' => 'error', 'message' => 'Paramètres nom ou type manquants.'], 400);
            }
            $image = null;

            if ($imageFile instanceof UploadedFile) {
                // Récupérer le nom original du fichier (sans l'extension)
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);

                // Enregistrer l'image
                $image = $imageManagerService->createImage($imageName, $imageSubDirectory, $imageFile);
                $this->entityManager->persist($image);
            }

            // Créer ou mettre à jour le -service avec le service ServiceService
            $service = $this->serviceService->createOrUpdateService(null, [
                'nom' => $nom,
                'description' => $description,
                'titre' => $titre,
                'horaire' => $horaire,
                'carteZoo' => $carteZoo,
            ], $image, $request);
            // Attacher l'image au service
            if ($image !== null) {
                // Attacher l'image au service
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

    #[Route('/horaire', name: 'newHoraire', methods: ['POST'])]
    public function addHoraires(Request $request): Response
    {
        $horairesData = $request->get('horaires');
        if ($horairesData) {
            $horaires = json_decode($horairesData, true);
            // Logique pour sauvegarder les horaires dans la base de données
            // Par exemple, vous pouvez les attacher à un service existant

            return $this->json(['status' => 'success', 'message' => 'Horaires ajoutés avec succès']);
        }

        return $this->json(['status' => 'error', 'message' => 'Données horaires non fournies'], 400);
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function updateService(int $id, Request $request): JsonResponse
    {
        try {
            $service = $this->entityManager->getRepository(Service::class)->find($id);
            if (!$service) {
                return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
            }

            // Récupérer les données du formulaire
            $nom = $request->get('nom');
            $description = $request->get('description');
            $titre = $request->get('titre');
            $horaire = $request->get('horaire');

            $carteZoo = $request->get('carteZoo');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $image = $this->imageManagerService->handleImageUpload($imageFile, $imageSubDirectory);

            // Utiliser createOrUpdateService pour mettre à jour le service
            $service = $this->serviceService->createOrUpdateService($service, [
                'nom' => $nom,
                'description' => $description,
                'titre' => $titre,
                'horaire' => $horaire,
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
                    $this->imageManagerService->deleteImage($image->getImagePath());
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
