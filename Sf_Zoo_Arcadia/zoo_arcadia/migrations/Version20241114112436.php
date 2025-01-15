<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241114112436 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE horaire ADD horaire_texte VARCHAR(255) NOT NULL, DROP jour, DROP heure_ouverture, DROP heure_fermeture');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE horaire ADD jour VARCHAR(25) NOT NULL, ADD heure_ouverture TIME NOT NULL, ADD heure_fermeture TIME NOT NULL, DROP horaire_texte');
    }
}
