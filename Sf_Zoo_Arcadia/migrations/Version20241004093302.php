<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241004093302 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE service DROP FOREIGN KEY FK_E19D9AD23DA5256D');
        $this->addSql('DROP INDEX UNIQ_E19D9AD23DA5256D ON service');
        $this->addSql('ALTER TABLE service ADD image VARCHAR(255) DEFAULT NULL, DROP image_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE service ADD image_id INT DEFAULT NULL, DROP image');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD23DA5256D FOREIGN KEY (image_id) REFERENCES image (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E19D9AD23DA5256D ON service (image_id)');
    }
}
