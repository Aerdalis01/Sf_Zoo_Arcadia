<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241004082009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alimentation ADD animal_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE alimentation ADD CONSTRAINT FK_8E65DFA08E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('CREATE INDEX IDX_8E65DFA08E962C16 ON alimentation (animal_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alimentation DROP FOREIGN KEY FK_8E65DFA08E962C16');
        $this->addSql('DROP INDEX IDX_8E65DFA08E962C16 ON alimentation');
        $this->addSql('ALTER TABLE alimentation DROP animal_id');
    }
}
