<?php

namespace App\Controller;

use App\Entity\Horaire;
use App\Service\HoraireService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/horaire', name: 'app_api_horaire_')]
class HoraireController extends AbstractController
{
    public function __construct(private HoraireService $horaireService, private SerializerInterface $serializer)
    {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $horaires = $this->horaireService->getAll();
        $data = $this->serializer->serialize($horaires, 'json', ['groups' => 'horaire']);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{jour}', name: 'show', methods: ['GET'])]
    public function show(string $jour): JsonResponse
    {
        $horaire = $this->horaireService->findByDay($jour);
        if (!$horaire) {
            return new JsonResponse(['error' => 'Horaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($horaire, 'json', ['groups' => 'horaire']);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function newAndUpdate(Request $request): Response
    {
        $jour = $request->request->get('jour');
        $heureOuverture = new \DateTime($request->request->get('heureOuverture'));
        $heureFermeture = new \DateTime($request->request->get('heureFermeture'));

        $existingHoraire = $this->horaireService->findByDay($jour);

        if ($existingHoraire) {
            $existingHoraire->setHeureOuverture($heureOuverture);
            $existingHoraire->setHeureFermeture($heureFermeture);
            $this->horaireService->save($existingHoraire);

            return new JsonResponse($existingHoraire, Response::HTTP_OK);
        } else {
            // Si aucun horaire n'existe, créez-en un nouveau
            $horaire = new Horaire();
            $horaire->setJour($jour);
            $horaire->setHeureOuverture($heureOuverture);
            $horaire->setHeureFermeture($heureFermeture);

            $this->horaireService->save($horaire);

            return new JsonResponse($horaire, Response::HTTP_CREATED);
        }
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function update(int $id, Request $request): Response
    {
        $horaire = $this->horaireService->getById($id);
        if (!$horaire) {
            return new JsonResponse(['error' => 'Horaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $horaire->setJour($request->request->get('jour'));
        $horaire->setHeureOuverture(new \DateTime($request->request->get('heureOuverture')));
        $horaire->setHeureFermeture(new \DateTime($request->request->get('heureFermeture')));

        $this->horaireService->save($horaire);

        return new JsonResponse($horaire, Response::HTTP_OK);
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $horaire = $this->horaireService->getById($id);
        if ($horaire) {
            $this->horaireService->delete($horaire);

            return new JsonResponse(['success' => 'Horaire supprimé avec succès'], Response::HTTP_OK);
        } else {
            return new JsonResponse(['error' => 'Horaire non trouvé'], Response::HTTP_NOT_FOUND);
        }
    }
}
