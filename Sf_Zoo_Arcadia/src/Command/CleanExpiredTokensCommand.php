<?php

namespace App\Command;

use App\Repository\TokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CleanExpiredTokensCommand extends Command
{
    protected static $defaultName = 'app:clean-expired-tokens';

    public function __construct(private TokenRepository $tokenRepository, private EntityManagerInterface $entityManager)
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setName('app:clean-expired-tokens')
            ->setDescription('Supprime les tokens expirés de la base de données.')
            ->setHelp('Cette commande permet de supprimer tous les tokens expirés...');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $expiredTokens = $this->tokenRepository->findExpiredTokens();

        foreach ($expiredTokens as $token) {
            $this->entityManager->remove($token);
        }

        $this->entityManager->flush();

        $output->writeln(count($expiredTokens).' tokens expirés supprimés.');

        return Command::SUCCESS;
    }
}
