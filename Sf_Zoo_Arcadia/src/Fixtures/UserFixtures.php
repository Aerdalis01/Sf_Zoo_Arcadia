<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Ajouter d'autres utilisateurs ou données ici
        $user = new User();
        $user->setEmail('capucinepouchard@gmail.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'dkf5sld/k5A'));
        $user->setRoles(['ROLE_VETERINAIRE']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $user = new User();
        $user->setEmail('vet2@gmail.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'kffekoO/158'));
        $user->setRoles(['ROLE_VETERINAIRE']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $user = new User();
        $user->setEmail('employe1@gmail.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'dkf5sld/k5A'));
        $user->setRoles(['ROLE_EMPLOYE']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $user = new User();
        $user->setEmail('employe2@gmail.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'afefMD/5d8'));
        $user->setRoles(['ROLE_EMPLOYE']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $user = new User();
        $user->setEmail('employe3@gmail.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, '2d4gMfL/df5'));
        $user->setRoles(['ROLE_EMPLOYE']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($user);
        $manager->flush();
    }
}
