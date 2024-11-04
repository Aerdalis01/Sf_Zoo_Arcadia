<?php



namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use PDO;

class TestController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/test', name: 'api_test_', methods: ['GET'])]
    public function testDbConnection(): JsonResponse
    {
        try {
            $pdo = new PDO('mysql:host=127.0.0.1;dbname=sf_zooarcadia', 'ZooAdmin', 'Fx7@!sLSPT1YEMCs');
            // Test de la connexion
            return $this->json(['status' => 'success', 'message' => 'Connexion réussie !']);
        } catch (\Exception $e) {
            return $this->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}