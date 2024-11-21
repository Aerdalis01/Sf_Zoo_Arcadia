<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LogoutController
{
    #[Route('/api/logout', name: 'app_api_logout_', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $request->getSession()->invalidate();

        $response = new JsonResponse(['message' => 'Déconnexion réussie'], Response::HTTP_OK);
        $response->headers->clearCookie('PHPSESSID');

        return $response;
    }
}
