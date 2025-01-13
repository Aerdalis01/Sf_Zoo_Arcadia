<?php

namespace App\Service;

use App\Entity\Animal;
use App\Entity\Race;
use App\Repository\RaceRepository;
use App\Service\ImageManagerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;

class RaceService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ImageManagerService $imageManager,
        private RequestStack $requestStack,
        private ParameterBagInterface $parameterBag,
        private RaceRepository $raceRepository
    ) {
    }
    public function createOrUpdateRace(?Race $entity, array $data): Race
    {
        if (!$entity) {
            $entity = new Race();
        }

        $entity->setNom($data['nom'] ?? $entity->getNom());

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return $entity;
    }

    public function getRaces(): array
    {
        return $this->raceRepository->findAll();
    }

    public function deleteRace(Race $race): void
    {
        $this->entityManager->remove($race);
        $this->entityManager->flush();
    }

    public function handleRace(?int $idRace, ?string $nomRace): Race|JsonResponse|null
    {
        if ($idRace) {
            $race = $this->entityManager->getRepository(Race::class)->find($idRace);
            if (!$race) {
                throw new \Exception('Race non trouvée');
            }
            return $race;
        }
        if ($nomRace) {
            $race = new Race();
            $race->setNom($nomRace);
            $this->entityManager->persist($race);
            $this->entityManager->flush();
            return $race;
        }

        throw new \Exception('Aucun ID de race ou nom de race fourni');
    }

    
}
