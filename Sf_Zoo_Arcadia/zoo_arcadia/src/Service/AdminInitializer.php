<?php

namespace App\Service;

use App\Entity\Token;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminInitializer
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private string $adminEmail;
    private string $adminPassword;
    private string $adminRole;
    private LoggerInterface $logger;

    public function __construct(
        ParameterBagInterface $parameterBag,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        LoggerInterface $logger,
        // #[Autowire(env: 'JWT_SECRET')] private readonly string $jwtSecret,
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->adminEmail = $parameterBag->get('admin_email');
        $this->adminPassword = $parameterBag->get('admin_password');
        $this->adminRole = $parameterBag->get('admin_role');
        $this->logger = $logger;
    }

    public function initializeAdmin(): void
    {
        $existingAdmin = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->adminEmail]);

        if (!$existingAdmin) {
            $admin = new User();
            $admin->setEmail($this->adminEmail);
            $admin->setPassword($this->passwordHasher->hashPassword($admin, $this->adminPassword));
            $admin->setRoles([$this->adminRole]);
            $admin->setCreatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($admin);
            $this->entityManager->flush();
            // Générez un token JWT
            // $payload = [
            //     'user_id' => $admin->getId(),
            //     'email' => $admin->getEmail(),
            //     'roles' => $admin->getRoles(),
            //     'exp' => time() + 3600, // 1 heure d'expiration
            // ];
            // $tokenString = JWT::encode($payload, $this->jwtSecret, 'HS256');

            // $token = new Token();
            // $token->setToken($tokenString);
            // $token->setExpireAt((new \DateTimeImmutable())->modify('+1 hour'));
            // $token->setUser($admin);

            // $this->entityManager->persist($token);
            // $this->entityManager->flush();

            $this->logger->info("Admin user created successfully with email {$this->adminEmail}.");
        }
    }
}
