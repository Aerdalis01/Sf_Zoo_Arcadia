<?php

namespace App\Command;

use App\Service\AdminInitializer;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class InitializeAdminCommand extends Command
{
    protected static $defaultName = 'app:create-admin';
    private AdminInitializer $adminInitializer;

    public function __construct(AdminInitializer $adminInitializer)
    {
        parent::__construct();
        $this->adminInitializer = $adminInitializer;
    }

    protected function configure(): void
    {
        $this->setDescription('Creates an admin user if it does not exist.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->adminInitializer->initializeAdmin();
        $output->writeln('Admin user initialization complete.');

        return Command::SUCCESS;
    }
}
