<?php

namespace App\Repository;

use App\Entity\Avis;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Avis>
 */
class AvisRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Avis::class);
    }

    public function findLatestAvis(int $limit = 6)
    {
        return $this->createQueryBuilder('a')
            ->where('a.valid = :valid')
            ->setParameter('valid', true)
            ->orderBy('a.createdAt', 'DESC')  
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
