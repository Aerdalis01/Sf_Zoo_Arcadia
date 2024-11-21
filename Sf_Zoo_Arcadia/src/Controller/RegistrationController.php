<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[IsGranted('ROLE_ADMIN')]
#[Route('/api/admin/register', name: '_app_api_admin_register_')]
class RegistrationController extends AbstractController
{
    public function __construct(
        private MailerService $mailer,
        private LoggerInterface $logger,
        private array $rolesMap
    ) {
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createUser(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): Response {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        if (!$data || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
            return new JsonResponse([
                'status' => 'error',
                'errors' => 'Email, mot de passe ou rôle requis',
            ], 400);
        }

        // Validation de l'email
        $user = new User();
        $user->setEmail($data['email']);
        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            return new JsonResponse([
                'status' => 'error',
                'errors' => (string) $errors,
            ], 400);
        }

        // Vérification de l'unicité de l'email
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse([
                'status' => 'error',
                'errors' => 'Cet email est déjà utilisé.',
            ], 400);
        }

        // Validation du rôle
        $rolesMap = [
            'admin' => ['ROLE_ADMIN'],
            'employe' => ['ROLE_EMPLOYE'],
            'veterinaire' => ['ROLE_VETERINAIRE'],
        ];

        if (!array_key_exists($data['role'], $rolesMap)) {
            return new JsonResponse([
                'status' => 'error',
                'errors' => 'Rôle invalide',
            ], 400);
        }

        // Attribution des rôles
        $user->setRoles($rolesMap[$data['role']]);

        try {
            // Hashage du mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Envoi de l'email avant la persistance
            $this->mailer->sendAccountCreationEmail($user->getEmail(), $user->getEmail());

            // Persister et enregistrer l'utilisateur
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse([
                'status' => 'success',
                'data' => ['message' => 'Inscription réussie'],
            ], 201);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la création de l\'utilisateur : '.$e->getMessage());

            return new JsonResponse([
                'status' => 'error',
                'errors' => 'Erreur interne lors de la création de l\'utilisateur',
            ], 500);
        }
    }
}
