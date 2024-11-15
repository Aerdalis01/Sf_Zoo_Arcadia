<?php

namespace App\DataFixtures;

use App\Entity\Contact;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ContactFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Données fictives pour les messages de contact
        $contactsData = [
            [
                'email' => 'alice@example.com',
                'titre' => 'Demande d\'information',
                'message' => 'Je souhaiterais obtenir plus de détails sur les tarifs.',
                'isResponded' => true,
                'responseMessage' => 'Bonjour, merci pour votre intérêt. Voici les informations...',
                'respondedAt' => new \DateTimeImmutable('-2 days'),
            ],
            [
                'email' => 'bob@example.com',
                'titre' => 'Problème technique',
                'message' => 'J\'ai des difficultés à utiliser le site.',
                'isResponded' => false,
                'responseMessage' => null,
                'respondedAt' => null,
            ],
            [
                'email' => 'charlie@example.com',
                'titre' => 'Réservation annulée',
                'message' => 'J\'ai besoin d\'aide pour annuler une réservation.',
                'isResponded' => true,
                'responseMessage' => 'Votre réservation a été annulée avec succès.',
                'respondedAt' => new \DateTimeImmutable('-1 day'),
            ],
            [
                'email' => 'david@example.com',
                'titre' => 'Demande de partenariat',
                'message' => 'Je souhaite proposer un partenariat.',
                'isResponded' => false,
                'responseMessage' => null,
                'respondedAt' => null,
            ],
            [
                'email' => 'eve@example.com',
                'titre' => 'Merci pour votre accueil',
                'message' => 'Nous avons passé un moment formidable, merci !',
                'isResponded' => true,
                'responseMessage' => 'Merci beaucoup pour vos retours positifs !',
                'respondedAt' => new \DateTimeImmutable('-3 days'),
            ],
        ];

        foreach ($contactsData as $data) {
            $contact = new Contact();
            $contact->setEmail($data['email']);
            $contact->setTitre($data['titre']);
            $contact->setMessage($data['message']);
            $contact->setIsResponded($data['isResponded']);
            $contact->setResponseMessage($data['responseMessage']);
            $contact->setRespondedAt($data['respondedAt']);

            $manager->persist($contact);
        }

        // Enregistre toutes les entités en base
        $manager->flush();
    }
}
