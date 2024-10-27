<?php

namespace App\Controller;

use App\Entity\Alimentation;
use App\Entity\Animal;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/alimentation', name: 'app_api_alimentation_')]
class AlimentationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private Security $security
    ) {
    }
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $alimentation = $this->em->getRepository(Alimentation::class)->findAll();
        ;
        $data = $this->serializer->serialize($alimentation, 'json', ['groups' => 'alimentation']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }
    #[Route('/reports', name: 'reports', methods: ['GET'])]
    public function getAlimentationReports(): JsonResponse
    {
        $query = $this->em->createQueryBuilder()
        ->select('a', 'an') // Sélectionne l'entité Alimentation et Animal
        ->from(Alimentation::class, 'a')
        ->leftJoin('a.animal', 'an') // Joins l'entité Animal associée
        ->getQuery();

    $alimentationReports = $query->getArrayResult();

    foreach ($alimentationReports as &$report) {
        if (isset($report['date']) && $report['date'] instanceof \DateTime) {
            $report['formattedDate'] = $report['date']->format('Y-m-d');
        } else {
            $report['formattedDate'] = null;
        }

        if (isset($report['heure']) && $report['heure'] instanceof \DateTime) {
            $report['formattedHeure'] = $report['heure']->format('H:i:s');
        } else {
            $report['formattedHeure'] = null;
        }
    }


    $data = $this->serializer->serialize($alimentationReports, 'json', ['groups' => 'alimentation']);

    return new JsonResponse($data, 200, [], true); // `true` pour éviter de re-sérialiser
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $alimentation = $this->em->getRepository(Alimentation::class)->find($id);
        ;
        if (!$alimentation) {
            return new JsonResponse(['error' => 'Habitat not found'], 404);
        }
        $data = $this->serializer->serialize($alimentation, 'json', ['groups' => 'alimentation']);

        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request): Response
    {

        try {
            if (!$this->isGranted('ROLE_ADMIN') && !$this->isGranted('ROLE_EMPLOYE')) {
                return new JsonResponse(['message' => 'Accès refusé'], 403);
            }

            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['message' => 'Aucun utilisateur connecté'], 401);
            }
            $email = $user->getUserIdentifier();

            $nourriture = $request->get('nourriture');
            $quantite = $request->get('quantite');
            $idAnimal = $request->get('idAnimal');

            if (!$nourriture || !$quantite || !$idAnimal) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Tous les champs sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            $animal = $this->em->getRepository(Animal::class)->find($idAnimal);
            if (!$animal) {
                return new JsonResponse(['status' => 'error', 'message' => 'Animal non trouvé'], 400);
            }

            $alimentation = new Alimentation();
            $alimentation->setNourriture($nourriture);
            $alimentation->setQuantite($quantite);
            $alimentation->setAnimal($animal);
            $alimentation->setCreatedBy($email);

            $this->em->persist($alimentation);
            $this->em->flush();

            return new JsonResponse([
                'status' => 'success',
                'message' => 'Alimentation créée avec succès',
                'alimentationId' => $alimentation->getId()
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur : ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteAlimentation(int $id): JsonResponse
    {
        try {
            $alimentation = $this->em->getRepository(Alimentation::class)->find($id);
            if (!$alimentation) {
                return new JsonResponse(['status' => 'error', 'message' => 'Alimentation non trouvée'], 404);
            }

            $this->em->remove($alimentation);
            $this->em->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Alimentation supprimée avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : ' . $e->getMessage()], 500);
        }
    }
}
