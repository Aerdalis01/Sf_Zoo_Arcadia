<?php

namespace App\DataFixtures;

use App\Entity\Alimentation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AlimentationFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $alimentationsData = [
            ['animal' => 'René le Cerf', 'nourriture' => 'Herbe', 'quantite' => '5 kg', 'createdBy' => 'employe1@gmail.com', 'isUsed' => true],
            ['animal' => 'Sarah le Ara', 'nourriture' => 'Fruits', 'quantite' => '200 g', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'babeth l\'Autruche', 'nourriture' => 'Grains', 'quantite' => '1 kg', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Alex le Canard branchu', 'nourriture' => 'Vers', 'quantite' => '300 g', 'createdBy' => 'employe1@gmail.com', 'isUsed' => false],
            ['animal' => 'Algor le Castor', 'nourriture' => 'Écorce', 'quantite' => '1.5 kg', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'Léo le Chimpanzé', 'nourriture' => 'Fruits et feuilles', 'quantite' => '2 kg', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Basile l\'Éléphant', 'nourriture' => 'Feuilles', 'quantite' => '10 kg', 'createdBy' => 'employe1@gmail.com', 'isUsed' => true],
            ['animal' => 'jack le Flamant Rose', 'nourriture' => 'Algues', 'quantite' => '500 g', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'Jérémie le Fourmilier', 'nourriture' => 'Fourmis', 'quantite' => '700 g', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Joe le Gnou', 'nourriture' => 'Herbes', 'quantite' => '4 kg', 'createdBy' => 'employe1@gmail.com', 'isUsed' => true],
            ['animal' => 'Olaf le Héron', 'nourriture' => 'Poissons', 'quantite' => '300 g', 'createdBy' => 'employe2@gmail.com', 'isUsed' => false],
            ['animal' => 'Leila l\'Impala', 'nourriture' => 'Herbes', 'quantite' => '3 kg', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Jango le Ouistiti', 'nourriture' => 'Fruits et insectes', 'quantite' => '150 g', 'createdBy' => 'employe1@gmail.com', 'isUsed' => false],
            ['animal' => 'Flocon le Lapin des marais', 'nourriture' => 'Carottes', 'quantite' => '100 g', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'Lisa la Loutre', 'nourriture' => 'Poissons', 'quantite' => '400 g', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Gaston le Paresseux', 'nourriture' => 'Feuilles', 'quantite' => '250 g', 'createdBy' => 'employe1@gmail.com', 'isUsed' => true],
            ['animal' => 'Rhinocéros', 'nourriture' => 'Herbes', 'quantite' => '8 kg', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'Sofie la Girafe', 'nourriture' => 'Feuilles d’acacia', 'quantite' => '6 kg', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
            ['animal' => 'Benoit le Tatou', 'nourriture' => 'Insectes', 'quantite' => '200 g', 'createdBy' => 'employe1@gmail.com', 'isUsed' => false],
            ['animal' => 'Alban le Toucan', 'nourriture' => 'Fruits', 'quantite' => '150 g', 'createdBy' => 'employe2@gmail.com', 'isUsed' => true],
            ['animal' => 'Eliott le Zèbre', 'nourriture' => 'Herbes', 'quantite' => '5 kg', 'createdBy' => 'employe3@gmail.com', 'isUsed' => true],
        ];

        foreach ($alimentationsData as $data) {
            $alimentation = new Alimentation();

            $animal = $this->getReference($data['animal']);
            $alimentation->setAnimal($animal);

            $alimentation->setNourriture($data['nourriture']);
            $alimentation->setQuantite($data['quantite']);
            $alimentation->setCreatedBy($data['createdBy']);
            $alimentation->setIsUsed($data['isUsed']);

            $manager->persist($alimentation);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            AnimalFixtures::class, // Assure que les animaux sont chargés avant l'alimentation
            AppFixtures::class,    // Assure que les employés sont disponibles avant l'alimentation
        ];
    }
}
