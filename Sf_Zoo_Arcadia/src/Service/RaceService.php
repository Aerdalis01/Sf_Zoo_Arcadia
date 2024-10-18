<?php

namespace App\Service;


use App\Entity\Race;
use App\Repository\RaceRepository;
use App\Service\ImageManagerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class RaceService
{
  public function __construct(
    private EntityManagerInterface $entityManager, 
    private ImageManagerService $imageManager, 
    private RequestStack $requestStack,
    private ParameterBagInterface $parameterBag,
    private RaceRepository $raceRepository)
    {
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
  }