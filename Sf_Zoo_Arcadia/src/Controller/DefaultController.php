<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'home', methods: ['GET'])]
    public function index(): Response
    {
        // Chemin vers votre fichier index.html généré par Webpack
        return $this->render('index.html.twig');
    }
}
