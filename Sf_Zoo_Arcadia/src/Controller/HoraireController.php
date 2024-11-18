<?php

namespace App\Controller;

use App\Entity\Horaire;
use App\Repository\HoraireRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/horaire', name: 'app_api_horaire_')]
class HoraireController extends AbstractController
{
    public function __construct(private SerializerInterface $serializer, private EntityManagerInterface $em)
    {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $horaires = $this->em->getRepository(Horaire::class)->getAll();
        $data = $this->serializer->serialize($horaires, 'json', ['groups' => 'horaire']);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $horaire = $this->em->getRepository(Horaire::class)->find($id);

        if (!$horaire) {
            return new JsonResponse(['error' => 'Horaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($horaire, 'json', ['groups' => 'horaire']);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function newAndUpdate(Request $request): Response
    {
        try {
            $horaireTexte = $request->request->get('horaire');

            $horaire = new Horaire();
            $horaire->setHoraireTexte($horaireTexte);

            $this->em->persist($horaire);
            $this->em->flush();

            return new JsonResponse(['message' => 'Horaire créé avec succès'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur : '.$e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/update/{id}', name: 'update', methods: ['POST'])]
    public function update(int $id, Request $request): Response
    {
        $horaire = $this->em->getRepository(Horaire::class)->find($id);
        if (!$horaire) {
            return new JsonResponse(['error' => 'Horaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $horaire->setHoraireTexte($request->request->get('horaire'));

        $this->em->persist($horaire);
        $this->em->flush();

        return new JsonResponse($horaire, Response::HTTP_OK);
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, HoraireRepository $horaireRepository): Response
    {
        $horaire = $horaireRepository->find($id);

        if (!$horaire) {
            return new JsonResponse(['error' => 'Avis non trouvé'], 404);
        }

        $this->em->remove($horaire);
        $this->em->flush();

        return new JsonResponse(['success' => 'Horaire supprimé avec succès'], Response::HTTP_OK);
    }
}
