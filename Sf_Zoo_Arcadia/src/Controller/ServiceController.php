<?php

namespace App\Controller;

use App\Entity\Service;
use App\Repository\ServiceRepository;
use App\Service\ImageManagerService;
use App\Service\ServiceService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        private ImageManagerService $imageManagerService)
    {}

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $services = $entityManager->getRepository(Service::class)->findAll();
        
        $data = $serializer->serialize($services, 'json', ['groups' => 'service_basic']);
        
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
    public function createService(Request $request, ImageManagerService $imageManagerService):JsonResponse
    {
        try {
            $nom = $request->request->get('nom'); 
            $description = $request->request->get('description');
            $titre = $request->request->get('titre');
            $horaire = json_decode($request->get('horaire'), true);
            $carteZoo = $request->request->get('carteZoo');

            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            $imageName = $request->request->get('nom');
            
            if (!$nom) {
                return new JsonResponse(['status' => 'error', 'message' => 'Paramètres nom ou type manquants.'], 400);
            }
            
            $image = null;
            if ($imageFile instanceof UploadedFile) {
                // Récupérer le nom original du fichier (sans l'extension)
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                
                // Ajouter un timestamp unique pour garantir l'unicité
                $timestamp = time(); // Vous pouvez aussi utiliser uniqid() si nécessaire
                
                // Obtenir l'extension originale du fichier
                $extension = $imageFile->guessExtension();
                
                // Générer le nom final de l'image
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
                'carteZoo' => $carteZoo
            ], $image);
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
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }
    #[Route('/{id}', name: 'update', methods: ['POST'])]
    public function updateService(int $id, Request $request): JsonResponse
    {
        try {
            $service = $this->entityManager->getRepository(Service::class)->find($id);
    
            if (!$service) {
                return new JsonResponse(['status' => 'error', 'message' => 'Service non trouvé'], 404);
            }
    
            // Récupérer les données du formulaire
            $nom = $request->request->get('nom');
            $description = $request->request->get('description');
            $titre = $request->request->get('titre');
            $horaire = $request->get('horaire');
            
            $carteZoo = $request->request->get('carteZoo');
            
            // Vérification et gestion de l'image
            $imageFile = $request->files->get('file');
            $imageSubDirectory = $request->request->get('image_sub_directory');
            
            $image = null;
            if ($imageFile instanceof UploadedFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $timestamp = time();
                $extension = $imageFile->guessExtension();
                $imageName = sprintf('%s-%s.%s', $originalFilename, $timestamp, $extension);
                $image = $this->imageManagerService->createImage($imageName, $imageSubDirectory, $imageFile);
                $this->entityManager->persist($image);
            }
    
            // Utiliser createOrUpdateService pour mettre à jour le service
            $service = $this->serviceService->createOrUpdateService($service, [
                'nom' => $nom,
                'description' => $description,
                'titre' => $titre,
                'horaire' => $horaire,
                'carteZoo' => $carteZoo
            ], $image);
    
            $this->entityManager->persist($service);
            $this->entityManager->flush();
    
            return new JsonResponse(['status' => 'success', 'id' => $service->getId()], 200);
    
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }
    
    

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, ServiceRepository $ServicesRepository): Response
    {
        $Service = $ServicesRepository->find($id);
        
        if (!$Service) {
            return $this->json(['error' => 'Image not found'], Response::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($Service);
        $this->entityManager->flush();

        return $this->json(['message' => 'Service supprimée avec succès'], Response::HTTP_OK);
    }
    
    
}