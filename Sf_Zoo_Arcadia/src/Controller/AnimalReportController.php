<?php

namespace App\Controller;

use App\Entity\Alimentation;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\AnimalReport;
use App\Entity\Animal;
use App\Entity\HabitatComment;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/animalReport', name: 'app_api_animalReport_')]
class AnimalReportController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private Security $security
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
                ->leftJoin('habitat.habitatComment', 'habitatComment')
                ->addSelect('animal, alimentation, report');

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
            }
            $report['habitatComments'] = [];
            if (isset($report['alimentation']['animal']['habitat']['habitatComment'])) {
                foreach ($report['alimentation']['animal']['habitat']['habitatComment'] as $comment) {
                    $report['habitatComments'][] = [
                        'id' => $comment['id'],
                        'content' => $comment['content'] ?? 'Commentaire vide',
                        'createdAt' => isset($comment['createdAt']) ? $comment['createdAt']->format('Y-m-d H:i:s') : null,
                    ];
                }
            }
            return new JsonResponse($reports);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_VETERINAIRE') && !$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], 403);
            }

            $user = $this->getUser();
            $email = $user->getUserIdentifier();
            $alimentationId = (int) $request->get('alimentation');
            $etat = $request->get('etat');
            $commentairesHabitat = $request->get('habitatComments', []);

            if (!$etat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Tous les champs sont requis'], 400);
            }

            $alimentation = $this->em->getRepository(Alimentation::class)->find($alimentationId);
            if (!$alimentation) {
                return new JsonResponse(['status' => 'error', 'message' => 'Rapport d\'alimenation non trouvé'], 404);
            }

            // Créer un nouveau rapport vétérinaire
            $animalReport = new AnimalReport();
            $animalReport->setAlimentation($alimentation);
            $animalReport->setCreatedBy($email);
            $animalReport->setEtat($etat);

            $habitat = $alimentation->getAnimal()->getHabitat();

            foreach ($commentairesHabitat as $commentaireData) {
                $commentaire = new HabitatComment();
                $commentaire->setComment($commentaireData['comment'] ?? ''); 
                $commentaire->setHabitat($habitat);
                $this->em->persist($commentaire);
                $habitat->addHabitatComment($commentaire);
            }
            
            $this->em->persist($animalReport);
            $this->em->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Rapport vétérinaire créé avec succès']);
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur : ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
