<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241016190940 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
<<<<<<< HEAD:Sf_Zoo_Arcadia/migrations/Version20241004090547.php
=======
        $this->addSql('ALTER TABLE user DROP dtype');
>>>>>>> auth:Sf_Zoo_Arcadia/migrations/Version20241016190940.php
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user ADD dtype VARCHAR(255) NOT NULL');
    }
}
