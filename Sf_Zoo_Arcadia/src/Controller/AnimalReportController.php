<?php

namespace App\Controller;

use App\Entity\Alimentation;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\AnimalReport;
use App\Entity\Animal;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;


#[Route('/api/animalReport', name: 'app_api_animalReport_')]
class AnimalReportController extends AbstractController
{
    public function __construct(
      private EntityManagerInterface $em,
      private Security $security
      ) 
      {}

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_VETERINAIRE')) {
              return new JsonResponse(['message' => 'Accès refusé'], 403);
            }
            
            $user = $this->getUser();
            $email = $user->getUserIdentifier();
            $alimentation = $request->get('alimenation');
            $etat = $request->get('etat');
            
            if (!$alimentation || !$etat) {
                return new JsonResponse(['status' => 'error', 'message' => 'Tous les champs sont requis'], 400);
            }
            
            $alimentation = $this->em->getRepository(Alimentation::class)->find($alimentation);
            if (!$alimentation) {
                return new JsonResponse(['status' => 'error', 'message' => 'Rapport d\'alimenation non trouvé'], 404);
            }

            // Créer un nouveau rapport vétérinaire
            $animalReport = new AnimalReport();
            $animalReport->setAlimentation($alimentation);
            $animalReport->setCreatedBy($email);
            $animalReport->setEtat($etat);
            

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
