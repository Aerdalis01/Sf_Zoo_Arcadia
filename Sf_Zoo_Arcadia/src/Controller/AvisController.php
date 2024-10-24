<?php

namespace App\Controller;

use App\Entity\Avis;
use App\Repository\AvisRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/avis', name: 'app_api_avis_')]
class AvisController extends AbstractController
{
        public function __construct(
            private EntityManagerInterface $entityManager,
            private SerializerInterface $serializer
        ) 
        {
        }
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $avis = $this->entityManager->getRepository(Avis::class)->findAll();

        $data = $this->serializer->serialize($avis, 'json', ['groups' => 'avis']);
        
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }
    #[Route('/new', name: 'new', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        
        try {
            $nom = $request->request->get('nom');
            $avisText = $request->request->get('avis');
            $note = $request->request->get('note');
            $valid = $request->request->get('valid', false);

            if (!$nom || !$avisText || !$note) {
                throw new \Exception('Les champs nom, avis, et note sont obligatoires');
            }

            $avis = new Avis();
            $avis->setNom($nom);
            $avis->setAvis($avisText);
            $avis->setNote($note);
            $avis->setValid(false);
        
        $this->entityManager->persist($avis);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Avis créé avec succès'], Response::HTTP_CREATED);
    }catch (\Exception $e) {

        return new JsonResponse([
            'status' => 'error',
            'message' => 'Erreur : ' . $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


    #[Route('/{id}/approve', name: 'approve', methods: ['POST'])]
    public function approveReview($id, AvisRepository $avisRepository, EntityManagerInterface $em): JsonResponse
    {
        $avis = $avisRepository->find($id);
        if (!$avis) {
            return new JsonResponse(['error' => 'Avis non trouvé'], 404);
        }

        $avis->setValid(true);
        $em->persist($avis);
        $em->flush();

        return new JsonResponse(['message' => 'Avis validé avec succès']);
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteAvis(int $id, AvisRepository $avisRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $avis = $avisRepository->find($id);
        if (!$avis) {
            return new JsonResponse(['error' => 'Avis non trouvé'], 404);
        }

        $entityManager->remove($avis);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Avis supprimé avec succès']);
    }

    #[Route('/latest-avis', name: 'latest_avis', methods: ['GET'])]
    public function getLatestAvis(AvisRepository $avisRepository, SerializerInterface $serializer): JsonResponse
    {
        $latestAvis = $avisRepository->findLatestAvis(); 
        $jsonContent = $serializer->serialize($latestAvis, 'json', ['groups' => 'avis']);

        return new JsonResponse($jsonContent, 200, [], true);
    }
}