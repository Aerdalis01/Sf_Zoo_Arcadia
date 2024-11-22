<?php

namespace App\Controller;

use App\Entity\Token;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class LogoutController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }

    #[Route('/api/logout', name: 'app_api_logout_', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token manquant ou invalide'], 400);
        }

        $token = substr($authHeader, 7);

        $tokenEntity = $this->em->getRepository(Token::class)->findOneBy(['token' => $token]);

        if ($tokenEntity) {
            $userId = $tokenEntity->getUser()?->getId();
            $this->em->remove($tokenEntity);
            $this->em->flush();

            if ($userId) {
                $user = $this->em->getRepository(User::class)->find($userId);
                if (!$user) {
                    error_log("Utilisateur ID {$userId} supprimé.");
                } else {
                    error_log("Utilisateur ID {$userId} est toujours présent.");
                }
            }
        }

        return new JsonResponse(['message' => 'Déconnexion réussie'], 200);
    }
}
