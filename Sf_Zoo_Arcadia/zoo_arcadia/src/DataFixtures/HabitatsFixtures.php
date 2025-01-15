<?php

namespace App\DataFixtures;

use App\Entity\Habitat;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class HabitatsFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public function load(ObjectManager $manager): void
    {
        $imageMarais = $this->getReference('Marais');
        $imageSavane = $this->getReference('Savane');
        $imageJungle = $this->getReference('Jungle');

        $habitat1 = new Habitat();
        $habitat1->setNom('Marais');
        $habitat1->setDescription('Un environnent humide avec son lac et son bois. Venez
        découvrir des animaux emblématique de la région tel le cerf blanc et le héron cendré ainsi que le canard
        branchu, le castor, les loutres, les tortues et lapin des marais.');
        $habitat1->setCreatedAt(new \DateTimeImmutable());
        $habitat1->setImage($imageMarais);
        $manager->persist($habitat1);

        $habitat2 = new Habitat();
        $habitat2->setNom('Savane');
        $habitat2->setDescription('Dans cette vaste plaine de 2 hectares, venez à la rencontre
        des animaux les plus emblématiques d’Afrique. Eléphant, girafes, gnous, rhinocéros blancs, zèbres , autruches,
        impala et tous leurs petits évoluent harmonieusement dans ce territoire incroyable, pour votre
        plaisir !');
        $habitat2->setCreatedAt(new \DateTimeImmutable());
        $habitat2->setImage($imageSavane);
        $manager->persist($habitat2);

        $habitat3 = new Habitat();
        $habitat3->setNom('Jungle');
        $habitat3->setDescription('Dans un écosytème riche où la vie foisoinne, retrouvez le
        ouistiti, le fourmilier, le chimpanzé, le tatoo, le paresseux, le toucan, et le ara.');
        $habitat3->setCreatedAt(new \DateTimeImmutable());
        $habitat3->setImage($imageJungle);
        $manager->persist($habitat3);

        $manager->flush();

        $this->addReference('habitat_marais', $habitat1);
        $this->addReference('habitat_savane', $habitat2);
        $this->addReference('habitat_jungle', $habitat3);
    }

    public function getDependencies(): array
    {
        return [
            ImagesFixtures::class,
        ];
    }

    public static function getGroups(): array
    {
        return ['group_habitats'];
    }
}
