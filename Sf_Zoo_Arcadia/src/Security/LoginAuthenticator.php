<?php

namespace App\Security;

use App\Entity\Token;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class LoginAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private EntityManagerInterface $em,
        #[Autowire(env: 'JWT_SECRET')] private readonly string $jwtSecret,
        private JwtService $jwtService,
        private UserProvider $userProvider,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository
    ) {
    }

    public function supports(Request $request): ?bool
    {
        $isApiRoute = str_starts_with($request->getPathInfo(), '/api');
        $isJsonRequest = $request->getContentTypeFormat() === 'json';
        $hasBearerToken = $request->headers->has('Authorization')
                           && str_starts_with($request->headers->get('Authorization'), 'Bearer ');

        // Cette ligne renverra true pour toute route API avec un token JWT ou /api/login
        return $isApiRoute && ($isJsonRequest || $hasBearerToken);
    }

    public function authenticate(Request $request): Passport
    {
        $path = $request->getPathInfo();

        if ($path === '/api/login') {
            $data = json_decode($request->getContent(), true);
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            if (!$email || !$password) {
                throw new CustomUserMessageAuthenticationException('Email ou mot de passe manquant.');
            }

            return new Passport(
                new UserBadge($email, function ($userIdentifier) {
                    return $this->userRepository->findOneBy(['email' => $userIdentifier]);
                }),
                new PasswordCredentials($password)
            );
        } else {
            $authHeader = $request->headers->get('Authorization');

            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                throw new CustomUserMessageAuthenticationException('Token manquant ou invalide.');
            }

            $token = substr($authHeader, 7);
            $decoded = $this->jwtService->decode($token);

            if (isset($decoded['exp']) && $decoded['exp'] < time()) {
                throw new CustomUserMessageAuthenticationException('Token expiré.');
            }
            if (!$decoded || !isset($decoded['email'])) {
                throw new CustomUserMessageAuthenticationException('Token invalide.');
            }
            $existingToken = $this->em->getRepository(Token::class)->findOneBy(['token' => $token]);
            if (!$existingToken) {
                throw new CustomUserMessageAuthenticationException('Token invalide ou supprimé.');
            }
            $user = $this->userRepository->findOneBy(['email' => $decoded['email']]);
            if (!$user) {
                throw new CustomUserMessageAuthenticationException('Utilisateur non trouvé.');
            }

            if (!in_array('ROLE_ADMIN', $user->getRoles(), true)) {
                throw new CustomUserMessageAuthenticationException('Accès refusé : vous n\'êtes pas administrateur.');
            }

            return new SelfValidatingPassport(
                new UserBadge($decoded['email'], function () use ($decoded) {
                    return $this->userRepository->findOneBy(['email' => $decoded['email']]);
                })
            );
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        if ($request->getPathInfo() === '/api/login') {
            $user = $token->getUser();

            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'Utilisateur non valide'], 401);
            }
            $existingToken = $this->em->getRepository(Token::class)->findOneBy(['user' => $user]);
            if ($existingToken) {
                return new JsonResponse(['message' => 'Utilisateur authentifié avec succès']);
            }
            $payload = [
                'user_id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'exp' => time() + 3600, // 1 heure d'expiration
            ];

            $tokenString = $this->jwtService->generateToken($payload);

            $tokenEntity = new Token();
            $tokenEntity->setToken($tokenString);
            $tokenEntity->setUser($user);
            $tokenEntity->setExpireAt(new \DateTimeImmutable('+1 hour'));

            $this->em->persist($tokenEntity);
            $this->em->flush();

            return new JsonResponse(['token' => $tokenString]);
        }

        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token manquant ou invalide'], 401);
        }

        $tokenString = substr($authHeader, 7);

        try {
            $decodedToken = $this->jwtService->decode($tokenString);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Token invalide'], 401);
        }

        return new JsonResponse(['message' => 'Utilisateur authentifié avec succès']);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(['error' => $exception->getMessage()], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
