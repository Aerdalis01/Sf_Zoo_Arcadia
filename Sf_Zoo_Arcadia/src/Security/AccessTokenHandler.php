<?php

namespace App\Security;

use App\Service\JwtService;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private readonly JwtService $jwtService,
        private readonly UserProviderInterface $userProvider
    ) {
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        $userData = $this->jwtService->decode($accessToken);
        $email = $userData['email'] ?? null;

        if (!$email) {
            throw new \Exception('Email non trouvé dans le token.');
        }

        // Créer un UserBadge en utilisant directement l'email
        return new UserBadge($email, function ($userIdentifier) {
            return $this->userProvider->loadUserByIdentifier($userIdentifier);
        });
    }
}
