<?php

namespace App\EventListener;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class JwtMiddleware
{
    private $secretKey;

    public function __construct(string $secretKey, private array $protectedRoutes)
    {
        $this->secretKey = $secretKey;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $routeName = $request->attributes->get('_route');

        if (!in_array($routeName, $this->protectedRoutes, true)) {
            return;
        }

        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new AccessDeniedHttpException('Token manquant ou invalide.');
        }

        $token = substr($authHeader, 7);
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));

            $request->attributes->set('jwt_payload', $decoded);
        } catch (\Exception $e) {
            throw new AccessDeniedHttpException('Token invalide ou expiré.');
        } catch (\Exception $e) {
            throw new AccessDeniedHttpException('Erreur lors du décodage du token.');
        }
    }
}
