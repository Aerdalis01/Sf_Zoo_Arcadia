<?php

namespace App\Security;


use App\Service\JwtService;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
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

        return new UserBadge($userData['email'], function ($userIdentifier) use ($userData) {
            return $this->userProvider->loadUserByIdentifier($userIdentifier);
        });
    }
}