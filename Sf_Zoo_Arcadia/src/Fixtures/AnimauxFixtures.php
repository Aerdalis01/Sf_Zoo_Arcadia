<?php

// src/DataFixtures/AnimalFixtures.php

namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Habitat;
use App\Entity\Race;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AnimalFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Données des animaux avec leur race, image, et habitat associés
        $animalsData = [
            ['nom' => 'René le Cerf', 'race' => 'Cerf', 'imageRef' => 'aerdalis01-photrealistic-a-white-cerf-selfie-386cd011-80ef-44a9-8ca4-4be08c9ca9ba-fotor-2024052112256-20241105132716-672a1d34014a9', 'habitat' => 'Marais'],
            ['nom' => 'Sarah le Ara', 'race' => 'Perroquet', 'imageRef' => 'Ara-66a100622141f', 'habitat' => 'Jungle'],
            ['nom' => 'babeth l\'Autruche', 'race' => 'Autruche', 'imageRef' => 'autruche-66a10654b954f', 'habitat' => 'Savane'],
            ['nom' => 'Alex le Canard branchu', 'race' => 'Canard', 'imageRef' => 'canard-66a1051de3c71', 'habitat' => 'Marais'],
            ['nom' => 'Algor le Castor', 'race' => 'Castor', 'imageRef' => 'castor-66a1052a5313a', 'habitat' => 'Marais'],
            ['nom' => 'Léo le Chimpanzé', 'race' => 'Singe', 'imageRef' => 'Chimpanze-66a10074e647f', 'habitat' => 'Jungle'],
            ['nom' => 'Basile l\'Éléphant', 'race' => 'Éléphant', 'imageRef' => 'elephant-66a1066c99a48', 'habitat' => 'Savane'],
            ['nom' => 'jack le Flamant Rose', 'race' => 'Flamant', 'imageRef' => 'Flamant-20241105132725-672a1d3d6503a', 'habitat' => 'Marais'],
            ['nom' => 'Jérémie le Fourmilier', 'race' => 'Fourmilier', 'imageRef' => 'Fourmilier-66a100819b3f9', 'habitat' => 'Jungle'],
            ['nom' => 'Joe le Gnou', 'race' => 'Antilope', 'imageRef' => 'Gnou-66a10682833be', 'habitat' => 'Savane'],
            ['nom' => 'Olaf le Héron', 'race' => 'Oiseau', 'imageRef' => 'heron-66a1056804ca0', 'habitat' => 'Marais'],
            ['nom' => 'Leila l\'Impala', 'race' => 'Antilope', 'imageRef' => 'impala-66a1069864089', 'habitat' => 'Savane'],
            ['nom' => 'Jango le Ouistiti', 'race' => 'Ouistiti', 'imageRef' => 'Jango le ouistiti', 'habitat' => 'Jungle'],
            ['nom' => 'Flocon le Lapin des marais', 'race' => 'Lapin', 'imageRef' => 'lapin-66a105e1033d9', 'habitat' => 'Marais'],
            ['nom' => 'Lisa la Loutre', 'race' => 'Loutre', 'imageRef' => 'loutre-66a105f491ec3', 'habitat' => 'Marais'],
            ['nom' => 'Gaston le Paresseux', 'race' => 'Paresseux', 'imageRef' => 'Paresseux-66a101edecc33', 'habitat' => 'Jungle'],
            ['nom' => 'Rhinocéros', 'race' => 'Rhinocéros', 'imageRef' => 'rhino-66a106cd3601f', 'habitat' => 'Savane'],
            ['nom' => 'Sofie la Girafe', 'race' => 'Girafe', 'imageRef' => 'Sofie la girafe', 'habitat' => 'Savane'],
            ['nom' => 'Benoit le Tatou', 'race' => 'Tatou', 'imageRef' => 'Tatoo-66a101ff327b6', 'habitat' => 'Jungle'],
            ['nom' => 'Alban le Toucan', 'race' => 'Toucan', 'imageRef' => 'Toucan-66a1020e370a5', 'habitat' => 'Jungle'],
            ['nom' => 'Eliott le Zèbre', 'race' => 'Zèbre', 'imageRef' => 'zebre-66a106e0e93f', 'habitat' => 'Savane'],
        ];

        foreach ($animalsData as $data) {
            $race = $manager->getRepository(Race::class)->findOneBy(['nom' => $data['race']]);
            if (!$race) {
                $race = new Race();
                $race->setNom($data['race']);
                $manager->persist($race);
            }

            $animal = new Animal();
            $animal->setNom($data['nom']);
            $animal->setRace($race);

            $image = $this->getReference($data['imageRef']);
            $animal->setImage($image);

            $habitat = $this->getReference($data['habitat']);
            $animal->setHabitat($habitat);

            $manager->persist($animal);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            ImagesFixtures::class,
            HabitatsFixtures::class,
        ];
    }
}
