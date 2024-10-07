<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

class FormLoginAuthenticator extends AbstractLoginFormAuthenticator
{
    private $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }
    public function authenticate(Request $request): Passport
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        return new SelfValidatingPassport(
            new UserBadge($email),
            [new PasswordCredentials($password)]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey): ?Response
    {
        $roles = $token->getRoleNames();

        if ($request->isXmlHttpRequest()) {
            return new JsonResponse(['status' => 'success', 'message' => 'Authentication successful'], 200);
        }
    
        $roleRedirects = [
            'ROLE_ADMIN' => 'admin_dashboard',
            'ROLE_VETERINAIRE' => 'veterinaire_dashboard',
            'ROLE_EMPLOYE' => 'employe_dashboard'
        ];
    
        foreach ($roles as $role) {
            if (isset($roleRedirects[$role])) {
                return new RedirectResponse($this->urlGenerator->generate($roleRedirects[$role]));
            }
        }
        
        return new RedirectResponse($this->urlGenerator->generate('default_route'));

    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
    if ($request->isXmlHttpRequest()) {
        $errorMessage = $exception instanceof CustomUserMessageAuthenticationException ? 
            $exception->getMessageKey() : 'Invalid credentials.';

        return new JsonResponse(['status' => 'error', 'message' => $errorMessage], 401);
    }


    $session = $request->getSession();

    if (!$session->isStarted()) {
        $session->start();
    }

    // Vérifier le type de l'exception
    if ($exception instanceof CustomUserMessageAuthenticationException) {
        $session->set('error_message', $exception->getMessageKey());
    } else {
        $session->set('error_message', 'Invalid credentials.');
    }

    return new RedirectResponse($this->urlGenerator->generate('login'));
    }
    


    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate('login');
    }
}