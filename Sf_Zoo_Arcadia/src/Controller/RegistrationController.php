<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;


#[Route('/api/register', name:'_app_api_register_')]
class RegistrationController extends AbstractController
{
   

    #[Route('/new', name:'new', methods:['POST'])]
    public function createUser(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
        // Décoder le JSON reçu depuis le front-end
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['email']) || empty($data['plainPassword'])) {
            return new JsonResponse(['errors' => 'Email et mot de passe requis'], 400);
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);

        // Hashage du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['plainPassword']);
        $user->setPassword($hashedPassword);

        // Persister l'utilisateur dans la base de données
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Inscription réussie'], 201);
    }
}