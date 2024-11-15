<?php

namespace App\DataFixtures;

use App\Entity\AnimalReport;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AnimalReportFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Liste des rapports pour chaque animal
        $reportsData = [
            ['animal' => 'René le Cerf', 'etat' => 'En bonne santé', 'etatDetail' => 'Le cerf montre un bon comportement général.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Sarah le Ara', 'etat' => 'Actif', 'etatDetail' => 'L’ara est actif et vocalise régulièrement.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'babeth l\'Autruche', 'etat' => 'Nerveuse', 'etatDetail' => 'L’autruche montre des signes de nervosité.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Alex le Canard branchu', 'etat' => 'Calme', 'etatDetail' => 'Le canard est calme et se nourrit bien.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Algor le Castor', 'etat' => 'En forme', 'etatDetail' => 'Le castor est en bonne santé et actif.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Léo le Chimpanzé', 'etat' => 'Joueur', 'etatDetail' => 'Le chimpanzé est joueur et social avec les visiteurs.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Basile l\'Éléphant', 'etat' => 'Sain', 'etatDetail' => 'L’éléphant est en bonne condition physique et actif.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'jack le Flamant Rose', 'etat' => 'Vigoureux', 'etatDetail' => 'Le flamant rose montre une activité vigoureuse.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Jérémie le Fourmilier', 'etat' => 'En bonne santé', 'etatDetail' => 'Le fourmilier est en bonne santé et actif.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Joe le Gnou', 'etat' => 'Actif', 'etatDetail' => 'Le gnou est en forme et se déplace souvent dans son enclos.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Olaf le Héron', 'etat' => 'Paisible', 'etatDetail' => 'Le héron est calme et ne montre aucun signe de stress.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Leila l\'Impala', 'etat' => 'En forme', 'etatDetail' => 'L’impala est active et montre un bon comportement.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Jango le Ouistiti', 'etat' => 'Curieux', 'etatDetail' => 'Le ouistiti est très curieux de son environnement.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Flocon le Lapin des marais', 'etat' => 'Calme', 'etatDetail' => 'Le lapin montre un comportement calme et stable.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Lisa la Loutre', 'etat' => 'Joueuse', 'etatDetail' => 'La loutre est en bonne santé et joue dans l’eau.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Gaston le Paresseux', 'etat' => 'Lent mais sain', 'etatDetail' => 'Le paresseux est lent comme d’habitude mais en bonne santé.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Rhinocéros', 'etat' => 'Fort', 'etatDetail' => 'Le rhinocéros est en bonne santé et très fort.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Sofie la Girafe', 'etat' => 'Alert', 'etatDetail' => 'La girafe est vigilante et montre des signes de bonne santé.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Benoit le Tatou', 'etat' => 'En bonne santé', 'etatDetail' => 'Le tatou est en bonne santé et est actif la nuit.', 'createdBy' => 'capucinepouchard@gmail.com'],
            ['animal' => 'Alban le Toucan', 'etat' => 'Vocal', 'etatDetail' => 'Le toucan est très vocal et en bonne santé.', 'createdBy' => 'vet2@gmail.com'],
            ['animal' => 'Eliott le Zèbre', 'etat' => 'Actif', 'etatDetail' => 'Le zèbre est en bonne forme physique.', 'createdBy' => 'capucinepouchard@gmail.com'],
        ];

        foreach ($reportsData as $data) {
            $report = new AnimalReport();

            // Associe l'animal par référence
            $animal = $this->getReference($data['animal']);
            $report->setAnimal($animal);

            // Associe l'alimentation de l'animal (on utilise l'alimentation la plus récente ici)
            $alimentation = $animal->getAlimentation()->first();
            $report->setAlimentation($alimentation);

            // Définit les autres attributs
            $report->setEtat($data['etat']);
            $report->setEtatDetail($data['etatDetail']);
            $report->setCreatedBy($data['createdBy']);

            $manager->persist($report);
        }

        // Enregistre toutes les entités en base
        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            AlimentationFixtures::class,
            AnimalFixtures::class,
            AppFixtures::class,
        ];
    }
}
