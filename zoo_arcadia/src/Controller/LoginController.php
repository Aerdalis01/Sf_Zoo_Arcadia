<?php

namespace App\Controller;

use App\Entity\Token;
use App\Entity\User;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class LoginController
{
    public function __construct(
        private readonly JwtService $jwtService,
        private EntityManagerInterface $em,
        private readonly Security $security
    ) {
    }

    #[Route('/api/login', name: '_app_api_login_', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        $payload = [
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600,
        ];

        $token = $this->jwtService->generateToken($payload);

        $expireAt = new \DateTimeImmutable('+1 hour');
        $tokenEntity = new Token();
        $tokenEntity->setUser($user);
        $tokenEntity->setToken($token);
        $tokenEntity->setExpireAt($expireAt);

        $this->em->persist($tokenEntity);
        $this->em->flush();

        return new JsonResponse(['token' => $token]);
    }
}
