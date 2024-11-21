<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LoginController
{
    #[Route('/api/login', name: '_app_api_login_', methods: ['POST'])]
    public function index(): Response
    {
        throw new \Exception();
    }
}
