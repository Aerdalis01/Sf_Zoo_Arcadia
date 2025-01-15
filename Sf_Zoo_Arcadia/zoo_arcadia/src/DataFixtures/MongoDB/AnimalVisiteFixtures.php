<?php

namespace App\DataFixtures\MongoDB;

use App\Document\AnimalVisite;
use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Persistence\ObjectManager;

class AnimalVisiteFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Données des visites d'animaux (animalId, nom, visites)
        $animalVisitsData = [
            ['animalId' => 1, 'nom' => 'René le Cerf', 'visites' => 150], // le plus de clics
            ['animalId' => 2, 'nom' => 'Sarah le Ara', 'visites' => 75],
            ['animalId' => 3, 'nom' => 'Babeth l\'Autruche', 'visites' => 50],
            ['animalId' => 4, 'nom' => 'Alex le Canard branchu', 'visites' => 30],
            ['animalId' => 5, 'nom' => 'Algor le Castor', 'visites' => 40],
            ['animalId' => 6, 'nom' => 'Léo le Chimpanzé', 'visites' => 60],
            ['animalId' => 7, 'nom' => 'Basile l\'Éléphant', 'visites' => 55],
            ['animalId' => 8, 'nom' => 'Jack le Flamant Rose', 'visites' => 25],
            ['animalId' => 9, 'nom' => 'Jérémie le Fourmilier', 'visites' => 45],
            ['animalId' => 10, 'nom' => 'Joe le Gnou', 'visites' => 35],
            ['animalId' => 11, 'nom' => 'Olaf le Héron', 'visites' => 20],
            ['animalId' => 12, 'nom' => 'Leila l\'Impala', 'visites' => 30],
            ['animalId' => 13, 'nom' => 'Jango le Ouistiti', 'visites' => 25],
            ['animalId' => 14, 'nom' => 'Flocon le Lapin des marais', 'visites' => 15],
            ['animalId' => 15, 'nom' => 'Lisa la Loutre', 'visites' => 40],
            ['animalId' => 16, 'nom' => 'Gaston le Paresseux', 'visites' => 22],
            ['animalId' => 17, 'nom' => 'Rhinocéros', 'visites' => 80],
            ['animalId' => 18, 'nom' => 'Sofie la Girafe', 'visites' => 55],
            ['animalId' => 19, 'nom' => 'Benoit le Tatou', 'visites' => 30],
            ['animalId' => 20, 'nom' => 'Alban le Toucan', 'visites' => 50],
            ['animalId' => 21, 'nom' => 'Eliott le Zèbre', 'visites' => 70],
        ];

        foreach ($animalVisitsData as $data) {
            $animalVisite = new AnimalVisite();
            $animalVisite->setAnimalId($data['animalId']);
            $animalVisite->setNom($data['nom']);
            $animalVisite->setVisites($data['visites']);

            $manager->persist($animalVisite);
        }

        // Enregistrement dans MongoDB
        $manager->flush();
    }
}
