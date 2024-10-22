<?php

namespace App\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class JwtService
{
    public function __construct(
        #[Autowire(env: 'JWT_SECRET')] private readonly string $jwtSecret
    ) {
    }

    public function encode(array $data): string
    {
        return JWT::encode($data, $this->jwtSecret, 'HS256');
    }

    public function decode(string $token): array
    {
        return (array) JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
    }
}