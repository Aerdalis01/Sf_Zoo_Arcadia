<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
    #[Route('/api/login', name: '_app_api_login_', methods: ['POST'])]
    public function index()
    {
    }
}
