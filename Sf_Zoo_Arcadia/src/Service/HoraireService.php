<?php

namespace App\Service;

use App\Entity\Horaire;
use Doctrine\ORM\EntityManagerInterface;

class HoraireService
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function save(Horaire $horaire): void
    {
        $this->em->persist($horaire);
        $this->em->flush();
    }

    public function getAll(): array
    {
        return $this->em->getRepository(Horaire::class)->findAll();
    }

    public function getById(int $id): ?Horaire
    {
        return $this->em->getRepository(Horaire::class)->find($id);
    }
    public function existsForDay(string $jour): bool
    {
        return $this->em->getRepository(Horaire::class)->findOneBy(['jour' => $jour]) !== null;
    }
    public function findByDay(string $jour): ?Horaire
{
    return $this->em->getRepository(Horaire::class)->findOneBy(['jour' => $jour]);
}
    public function delete(Horaire $horaire): void
    {
        $this->em->remove($horaire);
        $this->em->flush();
    }
}
