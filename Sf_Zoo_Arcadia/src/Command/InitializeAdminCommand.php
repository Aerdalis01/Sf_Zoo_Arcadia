<?php

namespace App\Command;

use App\Service\AdminInitializer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class InitializeAdminCommand extends Command
{
    protected static $defaultName = 'app:initialize-admin';
    private AdminInitializer $adminInitializer;

    public function __construct(
        AdminInitializer $adminInitializer,
        private EntityManagerInterface $em
    ) {
        parent::__construct();
        $this->adminInitializer = $adminInitializer;
    }

    protected function configure(): void
    {
        $this
            ->setName('app:initialize-admin')
            ->setDescription('Initialise un administrateur avec un token JWT.')
            ->setHelp('Cette commande crée un utilisateur administrateur et génère un token JWT.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->adminInitializer->initializeAdmin();
        $output->writeln('Admin user initialization complete.');

        return Command::SUCCESS;
    }
}
