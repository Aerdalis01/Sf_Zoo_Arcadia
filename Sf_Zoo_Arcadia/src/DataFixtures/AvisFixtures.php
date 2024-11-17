<?php

namespace App\DataFixtures;

use App\Entity\Avis;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AvisFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Données fictives pour les avis
        $avisData = [
            ['nom' => 'Alice Dupont', 'avis' => 'Super expérience, les animaux sont bien soignés.', 'note' => 5, 'valid' => true],
            ['nom' => 'Paul Martin', 'avis' => 'Belle journée en famille, mais un peu cher.', 'note' => 4, 'valid' => true],
            ['nom' => 'Claire Bonnet', 'avis' => 'Beaucoup d’attente à l’entrée.', 'note' => 3, 'valid' => false],
            ['nom' => 'Jean Durant', 'avis' => 'Pas assez de places de parking.', 'note' => 2, 'valid' => true],
            ['nom' => 'Marie Lefevre', 'avis' => 'Les enfants ont adoré, à refaire !', 'note' => 5, 'valid' => true],
            ['nom' => 'Marc Petit', 'avis' => 'Le personnel est accueillant et serviable.', 'note' => 4, 'valid' => false],
            ['nom' => 'Lucie Caron', 'avis' => 'Les animaux sont très bien traités.', 'note' => 5, 'valid' => true],
            ['nom' => 'David Garnier', 'avis' => 'Les animations sont bien organisées.', 'note' => 4, 'valid' => true],
            ['nom' => 'Sophie Brun', 'avis' => 'Un peu déçu par la restauration.', 'note' => 3, 'valid' => false],
            ['nom' => 'Emma Leroy', 'avis' => 'Le parc est très propre et bien entretenu.', 'note' => 5, 'valid' => true],
        ];

        foreach ($avisData as $data) {
            $avis = new Avis();
            $avis->setNom($data['nom']);
            $avis->setAvis($data['avis']);
            $avis->setNote($data['note']);
            $avis->setValid($data['valid']);

            $manager->persist($avis);
        }

        // Enregistre toutes les entités en base
        $manager->flush();
    }
}
