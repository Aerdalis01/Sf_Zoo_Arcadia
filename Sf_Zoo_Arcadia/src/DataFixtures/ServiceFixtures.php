<?php

namespace App\DataFixtures;

use App\Entity\Image;
use App\Entity\Service;
use App\Entity\SousService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ServiceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $imageDir = '/uploads/images/services/';
        // Service 1: Restauration
        $restauration = new Service();
        $restauration->setNom('Restauration')
            ->setTitre('Une envie de grignoter ou une petite faim?')
            ->setDescription(null)
            ->setHoraireTexte(null)
            ->setCarteZoo(false);

        $sousService1 = new SousService();
        $sousService1->setNom('Snack')
            ->setDescription('Un espace pour des snacks rapides et des boissons.')
            ->setMenu(false);
        $restauration->addSousService($sousService1);

        $imageSnack = new Image();
        $imageSnack->setNom('Image Snack')
            ->setImagePath($imageDir.'Snack.webp')
            ->setImageSubDirectory('services');
        $imageSnack->setSousService($sousService1);

        $manager->persist($imageSnack);
        $manager->persist($sousService1);

        $restaurant = new SousService();
        $restaurant->setNom('Restaurant')
            ->setDescription('Venez déguster la cuisine de notre chef !')
            ->setMenu(true);
        $restauration->addSousService($restaurant);

        $imageMenu = new Image();
        $imageMenu->setNom('menu-67063393cdcd7.svg')
            ->setImagePath($imageDir.'menu-67063393cdcd7.svg')
            ->setImageSubDirectory('services');
        $imageMenu->setSousService($restaurant);

        $imageResto = new Image();
        $imageResto->setNom('Resto')
            ->setImagePath($imageDir.'Resto.webp')
            ->setImageSubDirectory('services');
        $imageResto->setSousService($restaurant);

        $manager->persist($imageResto);
        $manager->persist($imageMenu);
        $manager->persist($restaurant);

        $sousService3 = new SousService();
        $sousService3->setNom('Camion glacé')
            ->setDescription('Une envie de douceur?')
            ->setMenu(false);
        $restauration->addSousService($sousService3);

        $imageCamionglace = new Image();
        $imageCamionglace->setNom('CamionGlace')
            ->setImagePath($imageDir.'CamionGlace.webp')
            ->setImageSubDirectory('services');
        $imageCamionglace->setSousService($sousService3);

        $manager->persist($imageCamionglace);
        $manager->persist($sousService3);

        $manager->persist($restauration);

        // Service 2: Visite guidée
        $visite = new Service();
        $visite->setNom('Visite guidée')
            ->setTitre('Suivez le guide !!')
            ->setDescription('Participez au visite guidée pour en apprendre plus sur les animaux et notre zoo.')
            ->setHoraireTexte(null)
            ->setCarteZoo(false);
        $imageVisite = new Image();
        $imageVisite->setNom('VisiteGuidee')
            ->setImagePath($imageDir.'VisiteGuidee.webp')
            ->setImageSubDirectory('services');
        $imageVisite->setService($visite);

        $manager->persist($imageVisite);

        $manager->persist($visite);

        // Service 3: Petit train
        $train = new Service();
        $train->setNom('Petit train')
            ->setTitre('En voiture !!')
            ->setDescription('Activités ludiques pour toute la famille.')
            ->setHoraireTexte(null)
            ->setCarteZoo(false);

        $imageTrain = new Image();
        $imageTrain->setNom('PetitTrain')
            ->setImagePath($imageDir.'PetitTrain.webp')
            ->setImageSubDirectory('services');
        $imageTrain->setService($train);

        $manager->persist($imageTrain);
        $manager->persist($train);

        // Service 4: Bien-être animal
        $infoService = new Service();
        $infoService->setNom('Info Service')
            ->setTitre('null')
            ->setDescription('null')
            ->setHoraireTexte('Départ des visites guidée: 
            09h00 
            11h00 
            13h00 
            15h00
            Départ des petits trains 
            10h00 
            12h00 
            14h00 
            16h00')
            ->setCarteZoo(true);

        $carteZoo = new Image();
        $carteZoo->setNom('carte-du-zoo')
            ->setImagePath($imageDir.'Carte-du-zoo-6705429dd14eb.svg')
            ->setImageSubDirectory('services');
        $carteZoo->setService($infoService);

        $manager->persist($carteZoo);
        $manager->persist($infoService);

        // Enregistrer en base de données
        $manager->flush();
    }
}
