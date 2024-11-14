<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Repository\ContactRepository;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/contact', name: '_app_api_contact_')]
#[IsGranted('ROLE_ADMIN', ['ROLE_EMPLOYE'])]
class ContactController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ValidatorInterface $validator,
        private ContactRepository $contactRepository,
        private MailerService $mailerService
    ) {
    }

    #[Route('/send', name: 'send', methods: ['POST'])]
    public function send(Request $request): JsonResponse
    {
        // Récupération des données du formulaire
        $email = $request->get('email');
        $titre = $request->get('titre');
        $message = $request->get('message');

        // Création d'une nouvelle instance de Contact
        $contact = new Contact();
        $contact->setEmail($email ?? '')
                ->setTitre($titre ?? '')
                ->setMessage($message ?? '');

        // Validation des données de l'entité Contact
        $errors = $this->validator->validate($contact);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Enregistrement en base de données
        $this->em->persist($contact);
        $this->em->flush();

        // Réponse de succès
        return new JsonResponse(['message' => 'Votre message a été envoyé avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(ContactRepository $contactRepository): JsonResponse
    {
        // Récupération de tous les messages de contact
        $messages = $contactRepository->findAll();

        // Transformation des données en tableau associatif pour JSON
        $data = array_map(function (Contact $contact) {
            return [
                'id' => $contact->getId(),
                'email' => $contact->getEmail(),
                'titre' => $contact->getTitre(),
                'message' => $contact->getMessage(),
                'isResponded' => $contact->isResponded(),
                'sendAt' => $contact->getSendAt()->format('Y-m-d H:i:s'),
                'responseMessage' => $contact->getResponseMessage(),
                'respondedAt' => $contact->getRespondedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $messages);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/respond/{id}', name: 'respond_to_message', methods: ['POST'])]
    public function respondToMessage(
        int $id,
        Request $request,
        MailerService $mailService,
        EntityManagerInterface $entityManager,
        ContactRepository $contactRepository
    ): JsonResponse {
        // Récupérer le message de contact par son ID
        $contact = $contactRepository->find($id);

        if (!$contact) {
            return new JsonResponse(['error' => 'Message non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupération de la réponse depuis les données envoyées
        $responseMessage = $request->get('responseMessage');

        if (!$responseMessage) {
            return new JsonResponse(['error' => 'Le message de réponse est requis'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Mise à jour du message avec la réponse
        $contact->setResponseMessage($responseMessage);
        $contact->setIsResponded(true);
        $contact->setRespondedAt(new \DateTimeImmutable());

        // Sauvegarde dans la base de données
        $entityManager->persist($contact);
        $entityManager->flush();

        $mailService->sendEmail(
            $contact->getEmail(),               // Récupération automatique de l'email du visiteur
            'Réponse à votre message : '.$contact->getTitre(),
            $responseMessage
        );

        return new JsonResponse(['message' => 'La réponse a été envoyée avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/delete/{id}', name: 'delete_contact', methods: ['DELETE'])]
    public function deleteContact(
        int $id,
        EntityManagerInterface $entityManager,
        ContactRepository $contactRepository
    ): JsonResponse {
        // Récupérer le message de contact par son ID
        $contact = $contactRepository->find($id);

        if (!$contact) {
            return new JsonResponse(['error' => 'Message non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Suppression du message
        $entityManager->remove($contact);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Message supprimé avec succès'], JsonResponse::HTTP_OK);
    }
}
