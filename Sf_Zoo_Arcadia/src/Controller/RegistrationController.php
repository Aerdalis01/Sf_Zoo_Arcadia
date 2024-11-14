<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/register', name: '_app_api_admin_register_')]
#[IsGranted('ROLE_ADMIN')]
class RegistrationController extends AbstractController
{
    public function __construct(private MailerService $mailer)
    {
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function createUser(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['errors' => 'Cet email est déjà utilisé.'], 400);
        }

        if (!$data || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
            return new JsonResponse(['errors' => 'Email, mot de passe ou rôle requis'], 400);
        }

        $validRoles = ['admin', 'employe', 'veterinaire'];
        if (!in_array($data['role'], $validRoles)) {
            return new JsonResponse(['errors' => ['Rôle invalide']], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        switch ($data['role']) {
            case 'admin':
                $user->setRoles(['ROLE_ADMIN']);
                break;
            case 'employe':
                $user->setRoles(['ROLE_EMPLOYE']);
                break;
            case 'veterinaire':
                $user->setRoles(['ROLE_VETERINAIRE']);
                break;
            default:
                return new JsonResponse(['errors' => 'Rôle invalide'], 400);
        }
        try {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Persister l'utilisateur dans la base de données
            $entityManager->persist($user);
            $entityManager->flush();

            // Envoi de l'e-mail de création de compte
            $this->mailer->sendAccountCreationEmail($user->getEmail(), $user->getEmail());

            return new JsonResponse(['message' => 'Inscription réussie'], 201);
        } catch (\Exception $e) {
            // Log the error for debugging
            error_log($e->getMessage());

            return new JsonResponse(['errors' => 'Erreur interne lors de la création de l\'utilisateur'], 500);
        }
    }
}
