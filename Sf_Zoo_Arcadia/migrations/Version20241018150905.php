<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241018150905 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE habitat DROP FOREIGN KEY FK_3B37B2E81E2076BD');
        $this->addSql('DROP INDEX IDX_3B37B2E81E2076BD ON habitat');
        $this->addSql('ALTER TABLE habitat DROP habitat_comment_id');
        $this->addSql('ALTER TABLE race DROP animals');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE habitat ADD habitat_comment_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE habitat ADD CONSTRAINT FK_3B37B2E81E2076BD FOREIGN KEY (habitat_comment_id) REFERENCES habitat (id)');
        $this->addSql('CREATE INDEX IDX_3B37B2E81E2076BD ON habitat (habitat_comment_id)');
        $this->addSql('ALTER TABLE race ADD animals VARCHAR(255) DEFAULT NULL');
    }
}
