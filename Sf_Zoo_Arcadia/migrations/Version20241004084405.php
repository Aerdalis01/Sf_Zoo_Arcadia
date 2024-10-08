<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241004084405 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE animal_report ADD veterinaire_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE animal_report ADD CONSTRAINT FK_7EDEB2585C80924 FOREIGN KEY (veterinaire_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_7EDEB2585C80924 ON animal_report (veterinaire_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE animal_report DROP FOREIGN KEY FK_7EDEB2585C80924');
        $this->addSql('DROP INDEX IDX_7EDEB2585C80924 ON animal_report');
        $this->addSql('ALTER TABLE animal_report DROP veterinaire_id');
    }
}
