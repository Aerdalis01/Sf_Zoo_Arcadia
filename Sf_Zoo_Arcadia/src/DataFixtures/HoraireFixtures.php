<?php

namespace App\DataFixtures;

use App\Entity\Horaire;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class HoraireFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Données fictives pour les horaires
        $horairesData = [
            'Lundi: 09h00 - 18h00
            Mardi: 09h00 - 18h00
            Mercredi: 09h00 - 18h00
            Jeudi: 09h00 - 18h00
            Vendredi: 09h00 - 18h00
            Samedi: 09h00 - 18h00
            Dimanche: Fermé',
        ];

        foreach ($horairesData as $texte) {
            $horaire = new Horaire();
            $horaire->setHoraireTexte($texte);

            $manager->persist($horaire);
        }

        $manager->flush();
    }
}
