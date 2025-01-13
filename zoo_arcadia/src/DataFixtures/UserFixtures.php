<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $usersData = [
            [
                'email' => 'capucinepouchard@gmail.com',
                'password' => 'dkf5sld/k5A',
                'roles' => ['ROLE_VETERINAIRE'],
            ],
            [
                'email' => 'vet2@gmail.com',
                'password' => 'kffekoO/158',
                'roles' => ['ROLE_VETERINAIRE'],
            ],
            [
                'email' => 'employe1@gmail.com',
                'password' => 'dkf5sld/k5A',
                'roles' => ['ROLE_EMPLOYE'],
            ],
            [
                'email' => 'employe2@gmail.com',
                'password' => 'afefMD/5d8',
                'roles' => ['ROLE_EMPLOYE'],
            ],
            [
                'email' => 'employe3@gmail.com',
                'password' => '2d4gMfL/df5',
                'roles' => ['ROLE_EMPLOYE'],
            ],
        ];

        foreach ($usersData as $data) {
            $user = new User();
            $user->setEmail($data['email']);
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
            $user->setRoles($data['roles']);
            $user->setCreatedAt(new \DateTimeImmutable());

            $manager->persist($user);
        }

        $manager->flush();
    }
}
