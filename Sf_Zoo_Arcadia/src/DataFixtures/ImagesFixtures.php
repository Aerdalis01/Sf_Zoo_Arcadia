<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ImagesFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $imageJungle = new Image();
        $imageJungle->setNom('Jungle');
        $imageJungle->setImagePath('/uploads/images/carousel/bg-jungle-carousel.webp');
        $imageJungle->setImageSubDirectory('habitats');

        $manager->persist($imageJungle);

        $imageMarais = new Image();
        $imageMarais->setNom('Marais');
        $imageMarais->setImagePath('/uploads/images/carousel/bg-marais-carousel.webp');
        $imageMarais->setImageSubDirectory('habitats');

        $manager->persist($imageMarais);

        $imageSavane = new Image();
        $imageSavane->setNom('Savane');
        $imageSavane->setImagePath('/uploads/images/carousel/Savane-lg.webp');
        $imageSavane->setImageSubDirectory('habitats');

        $manager->persist($imageSavane);

        // Chemin de base pour toutes les images d'animaux
        $imageDir = '/uploads/images/animals';

        // Liste des noms de fichiers
        $imageFiles = [
            'aerdalis01-photrealistic-a-white-cerf-selfie-386cd011-80ef-44a9-8ca4-4be08c9ca9ba-fotor-2024052112256-20241105132716-672a1d34014a9.webp',
            'Ara-66a100622141f.webp',
            'autruche-66a10654b954f.webp',
            'canard-66a1051de3c71.webp',
            'castor-66a1052a5313a.webp',
            'Chimpanze-66a10074e647f.webp',
            'elephant-66a1066c99a48.webp',
            'Flamant-20241105132725-672a1d3d6503a.webp',
            'Fourmilier-66a100819b3f9.webp',
            'Gnou.webp',
            'heron-66a1056804ca0.webp',
            'impala-66a1069864089.webp',
            'Jango le ouistiti.webp',
            'lapin-66a105e1033d9.webp',
            'loutre-66a105f491ec3.webp',
            'Paresseux-66a101edecc33.webp',
            'rhino-66a106cd3601f.webp',
            'Sofie la girafe.webp',
            'Tatoo-66a101ff327b6.webp',
            'Toucan-66a1020e370a5.webp',
            'zebre-66a106e0e93f2.webp',
        ];

        // Boucle pour créer chaque image
        foreach ($imageFiles as $fileName) {
            $image = new Image();
            $imageName = pathinfo($fileName, PATHINFO_FILENAME); // Nom sans l'extension
            $image->setNom($imageName);
            $image->setImagePath($imageDir.'\\'.$fileName);
            $image->setImageSubDirectory('animals');

            $manager->persist($image);

            // Ajouter une référence pour l'image
            $this->addReference($imageName, $image);
        }

        $manager->flush();

        $this->addReference('Jungle', $imageJungle);
        $this->addReference('Marais', $imageMarais);
        $this->addReference('Savane', $imageSavane);
    }

    public static function getGroups(): array
    {
        return ['group_images'];
    }

    public function getDependencies()
    {
        return [
            ServiceFixtures::class,
        ];
    }
}
