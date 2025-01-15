<?php

namespace App\Security;

use App\Service\JwtService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function __construct(
        private readonly JwtService $jwtService,
    ) {
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $user = $token->getUser();

        $jwt = $this->jwtService->encode([
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600,
        ]);

        return new JsonResponse(['token' => $jwt]);
    }
}
