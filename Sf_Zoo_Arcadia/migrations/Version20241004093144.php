<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241004093144 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image ADD service_id INT DEFAULT NULL, ADD sous_service_id INT DEFAULT NULL, ADD animal_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FB24FC0C FOREIGN KEY (sous_service_id) REFERENCES sous_service (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F8E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C53D045FED5CA9E6 ON image (service_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C53D045FB24FC0C ON image (sous_service_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C53D045F8E962C16 ON image (animal_id)');
        $this->addSql('ALTER TABLE service ADD image_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD23DA5256D FOREIGN KEY (image_id) REFERENCES image (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E19D9AD23DA5256D ON service (image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045FED5CA9E6');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045FB24FC0C');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F8E962C16');
        $this->addSql('DROP INDEX UNIQ_C53D045FED5CA9E6 ON image');
        $this->addSql('DROP INDEX UNIQ_C53D045FB24FC0C ON image');
        $this->addSql('DROP INDEX UNIQ_C53D045F8E962C16 ON image');
        $this->addSql('ALTER TABLE image DROP service_id, DROP sous_service_id, DROP animal_id');
        $this->addSql('ALTER TABLE service DROP FOREIGN KEY FK_E19D9AD23DA5256D');
        $this->addSql('DROP INDEX UNIQ_E19D9AD23DA5256D ON service');
        $this->addSql('ALTER TABLE service DROP image_id');
    }
}
