<?php

namespace App\Controller;

use App\Entity\Alimentation;
use App\Entity\Animal;
use App\Entity\AnimalReport;
use App\Entity\HabitatComment;
use App\Entity\Token;
use App\Service\JwtService;
use App\Service\TokenValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

#[Route('/api/animalReport', name: 'app_api_animalReport_')]
class AnimalReportController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private Security $security,
        private TokenValidatorService $tokenValidator,
        private JwtService $jwtService
    ) {
    }

    #[Route('/view', name: 'admin_reports', methods: ['GET'])]
    public function getAnimalReports(Request $request): JsonResponse
    {
        try {
            $animalId = $request->query->get('animalId');
            $date = $request->query->get('date');

            $sortBy = $request->query->get('sortBy', 'createdAt');
            $sortOrder = $request->query->get('sortOrder', 'ASC');

            $queryBuilder = $this->em->getRepository(AnimalReport::class)->createQueryBuilder('report')
                ->leftJoin('report.alimentation', 'alimentation')
                ->leftJoin('alimentation.animal', 'animal')
                ->leftJoin('animal.habitat', 'habitat')
                ->leftJoin('habitat.habitatComments', 'habitatComment')
                ->addSelect('animal, alimentation, report, habitat, habitatComment');

            // Appliquer le filtre par animal si fourni
            if ($animalId) {
                $queryBuilder->andWhere('animal.id = :animalId')
                    ->setParameter('animalId', $animalId);
            }

            // Appliquer le filtre par date si fourni
            if ($date) {
                $queryBuilder->andWhere('DATE(report.createdAt) = DATE(:date)')
                    ->setParameter('date', $date);
            }
            if (in_array($sortBy, ['createdAt', 'etat', 'animal.nom'])) { // Liste des champs sur lesquels on peut trier
                if ($sortBy === 'animal.nom') {
                    $queryBuilder->orderBy('animal.nom', $sortOrder); // Trie par le nom de l'animal
                } else {
                    $queryBuilder->orderBy("report.$sortBy", $sortOrder); // Trie par les champs du rapport
                }
            }

            $reports = $queryBuilder->getQuery()->getArrayResult();

            foreach ($reports as &$report) {
                // Formater createdAt pour obtenir la date et l'heure de création du rapport
                if (isset($report['createdAt']) && $report['createdAt'] instanceof \DateTimeImmutable) {
                    $report['dateCreated'] = $report['createdAt']->format('Y-m-d'); // Format de la date
                    $report['heureCreated'] = $report['createdAt']->format('H:i:s'); // Format de l'heure
                } else {
                    $report['dateCreated'] = null;
                    $report['heureCreated'] = null;
                }

                // Inclure le nom de l'animal, la nourriture et la quantité d'alimentation
                if (isset($report['alimentation'])) {
                    $report['animalNom'] = $report['alimentation']['animal']['nom'] ?? 'Animal inconnu';
                    $report['nourriture'] = $report['alimentation']['nourriture'] ?? 'Nourriture inconnue';
                    $report['quantite'] = $report['alimentation']['quantite'] ?? 'Quantité inconnue';
                } else {
                    $report['animalNom'] = 'Animal inconnu';
                    $report['nourriture'] = 'Nourriture inconnue';
                    $report['quantite'] = 'Quantité inconnue';
                }

                $report['createdBy'] = isset($report['createdBy']) ? $report['createdBy'] : 'Inconnu';

                $report['habitatComments'] = [];

                // Filtrer les commentaires d'habitat pour supprimer les valeurs null
                if (isset($report['alimentation']['animal']['habitat']['habitatComments'])) {
                    $filteredComments = array_filter(
                        $report['alimentation']['animal']['habitat']['habitatComments'],
                        fn ($comment) => $comment !== null
                    );

                    usort($filteredComments, fn ($a, $b) => $b['createdAt'] <=> $a['createdAt']);

                    // Ajouter seulement le dernier commentaire (le plus récent)
                    $lastComment = $filteredComments[0] ?? null;
                    if ($lastComment) {
                        $report['habitatComments'] = [
                            [
                                'id' => $lastComment['id'],
                                'content' => $lastComment['comment'] ?? 'Commentaire vide',
                                'createdAt' => isset($lastComment['createdAt']) ? $lastComment['createdAt']->format('Y-m-d H:i:s') : null,
                            ],
                        ];
                    } else {
                        // Pas de commentaire disponible
                        $report['habitatComments'] = [];
                    }
                } else {
                    $report['habitatComments'] = [];
                }
            }

            return new JsonResponse($reports);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur : '.$e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/view/{id}', name: 'view_report', methods: ['GET'])]
    public function getAnimalReportByAlimentationId(int $id): JsonResponse
    {
        try {
            $animalReport = $this->em->getRepository(AnimalReport::class)->findOneBy(['alimentation' => $id]);

            if (!$animalReport) {
                return new JsonResponse(['status' => 'error', 'message' => 'Rapport vétérinaire non trouvé'], Response::HTTP_NOT_FOUND);
            }
            $habitat = $animalReport->getAlimentation()->getAnimal()->getHabitat();
            $habitatComments = $habitat ? $habitat->getHabitatComment() : [];

            $response = [
                'id' => $animalReport->getId(),
                'etat' => $animalReport->getEtat(),
                'etatDetail' => $animalReport->getEtatDetail(),
                'createdBy' => $animalReport->getCreatedBy(),
                'createdAt' => $animalReport->getCreatedAt(),
                'alimentationId' => $animalReport->getAlimentation()->getId(),
                'habitatComments' => array_map(fn ($comment) => [
                    'id' => $comment->getId(),
                    'content' => $comment->getComment(),
                    'createdAt' => $comment->getCreatedAt(),
                ], $habitatComments->toArray()),
            ];

            return new JsonResponse($response);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur : '.$e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createOrUpdate(Request $request): JsonResponse
    {
        try {
            $authorizationHeader = $request->headers->get('Authorization');

            if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
                return new JsonResponse(['error' => 'Token manquant ou invalide'], 401);
            }

            $token = substr($authorizationHeader, 7);

            $existingToken = $this->em->getRepository(Token::class)->findOneBy(['token' => $token]);
            if (!$existingToken) {
                throw new CustomUserMessageAuthenticationException('Token invalide ou supprimé.');
            }
            try {
                $decodedToken = $this->jwtService->decode($token);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => $e->getMessage()], 401);
            }

            $requiredRoles = ['ROLE_ADMIN', 'ROLE_EMPLOYE'];
            $userRoles = $decodedToken['roles'] ?? [];

            if (empty(array_intersect($requiredRoles, $userRoles))) {
                return new JsonResponse(['error' => 'Accès interdit'], 401);
            }

            $email = $decodedToken['email'] ?? null;

            $reportId = $request->get('id');
            $alimentationId = (int) $request->get('alimentation');
            $etat = $request->get('etat');
            $etatDetail = $request->get('etatDetail');
            $commentaireHabitat = $request->get('habitatComments');
            $animalId = $request->get('id');

            if (!$etat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Tous les champs sont requis'], 400);
            }

            $animalReport = $this->em->getRepository(AnimalReport::class)->findOneBy(['alimentation' => $alimentationId]);
            if (!$animalReport) {
                // Création d'un nouveau rapport
                $animalReport = new AnimalReport();
                $alimentation = $this->em->getRepository(Alimentation::class)->find($alimentationId);
                $animalReport->setAlimentation($alimentation);
            } else {
                // Mise à jour : récupérer l'alimentation existante
                $alimentation = $animalReport->getAlimentation();
            }

            // Mettre à jour l'attribut `isUsed` de l'alimentation
            $alimentation->setIsUsed(true);

            $animal = $this->em->getRepository(Animal::class)->find($animalId);
            if (!$animal) {
                return new JsonResponse(['status' => 'error', 'message' => 'Animal introuvable'], 404);
            }
            // Mise à jour ou création des valeurs du rapport
            $animalReport->setCreatedBy($email);
            $animalReport->setEtat($etat);
            $animalReport->setEtatDetail($etatDetail);
            $animalReport->setAnimal($animal);

            // Gestion des commentaires d'habitat
            $habitat = $animalReport->getAlimentation()->getAnimal()->getHabitat();
            if (!empty($commentaireHabitat)) {
                $commentaire = new HabitatComment();
                $commentaire->setComment($commentaireHabitat);
                $commentaire->setHabitat($habitat);
                $this->em->persist($commentaire);
                $habitat->addHabitatComment($commentaire);
            }

            $this->em->persist($animalReport);
            $this->em->flush();

            return new JsonResponse([
                'status' => 'success',
                'message' => $reportId ? 'Rapport vétérinaire mis à jour avec succès' : 'Rapport vétérinaire créé avec succès',
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur : '.$e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
