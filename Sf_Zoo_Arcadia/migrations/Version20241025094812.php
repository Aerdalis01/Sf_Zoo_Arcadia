<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241025094812 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE animal_report ADD alimentation_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE animal_report ADD CONSTRAINT FK_7EDEB2588441D4D9 FOREIGN KEY (alimentation_id) REFERENCES alimentation (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7EDEB2588441D4D9 ON animal_report (alimentation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE animal_report DROP FOREIGN KEY FK_7EDEB2588441D4D9');
        $this->addSql('DROP INDEX UNIQ_7EDEB2588441D4D9 ON animal_report');
        $this->addSql('ALTER TABLE animal_report DROP alimentation_id');
    }
}
