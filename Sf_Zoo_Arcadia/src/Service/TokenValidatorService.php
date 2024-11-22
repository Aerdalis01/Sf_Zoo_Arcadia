<?php

namespace App\Service;

use App\Entity\Token;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

class TokenValidatorService
{
    private EntityManagerInterface $entityManager;
    private JwtService $jwtService;

    public function __construct(EntityManagerInterface $entityManager, JwtService $jwtService)
    {
        $this->entityManager = $entityManager;
        $this->jwtService = $jwtService;
    }

    public function validateTokenAndRoles(string $authorizationHeader, array $requiredRoles): array
    {
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            throw new CustomUserMessageAuthenticationException('Token manquant ou invalide.');
        }

        $token = substr($authorizationHeader, 7);

        $existingToken = $this->entityManager->getRepository(Token::class)->findOneBy(['token' => $token]);
        if (!$existingToken) {
            throw new CustomUserMessageAuthenticationException('Token invalide ou supprimé.');
        }

        try {
            $decodedToken = $this->jwtService->decode($token);
        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException($e->getMessage());
        }

        $userRoles = $decodedToken['roles'] ?? [];

        if (empty(array_intersect($requiredRoles, $userRoles))) {
            throw new CustomUserMessageAuthenticationException('Accès interdit.');
        }

        return $decodedToken;
    }
}
