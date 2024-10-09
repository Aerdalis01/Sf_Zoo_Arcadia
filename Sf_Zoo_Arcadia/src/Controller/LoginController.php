<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Routing\Annotation\Route;

// class AuthController extends AbstractController
// {
//     #[Route('/api/login', name:'_app_api_login_', methods:['GET'])]
//     public function index(): Response
//     {
//         dd($this->getUser()->getToken());
//         if (null === $user) {
//             return $this->json([
//                 'message' => 'missing credentials',
//             ], Response::HTTP_UNAUTHORIZED);
//         }

//         return $this->json([

//             'user'  => $user->getUserIdentifier(),
//             'token' => null,
//           ]);
//     }


// }