<?php

namespace App\Repository;

use App\Entity\Alimentation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Alimentation>
 */
class AlimentationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Alimentation::class);
    }

    public function findAllWithAnimal(): array
    {
        
        return $this->createQueryBuilder('a')
            ->leftJoin('a.animal', 'animal')
            ->addSelect('animal')
            ->getQuery()
            ->getResult();
        
    }
}
