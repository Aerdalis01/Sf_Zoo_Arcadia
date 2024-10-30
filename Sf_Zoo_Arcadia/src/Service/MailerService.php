<?php

namespace App\Service;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerService
{
    private MailerInterface $mailer;
    private string $fromEmail;

    public function __construct(MailerInterface $mailer, string $fromEmail)
    {
        $this->mailer = $mailer;
        $this->fromEmail = $fromEmail;
    }

    public function sendEmail(string $to, string $subject, string $body): void
    {
        $email = (new Email())
            ->from($this->fromEmail)
            ->to($to)
            ->subject($subject)
            ->text($body);

        $this->mailer->send($email);
    }

    public function sendAccountCreationEmail(string $userEmail, string $username): void
{
    $email = (new Email())
        ->from('admin@votre-site.com')
        ->to($userEmail)
        ->subject('Création de votre compte')
        ->html("
            <p>Bonjour,</p>
            <p>Votre compte a été créé avec succès.</p>
            <p>Votre nom d'utilisateur est : <strong>{$username}</strong>.</p>
            <p>Veuillez contacter votre administrateur pour obtenir votre mot de passe.</p>
            <p>Cordialement,<br>L'équipe de gestion</p>
        ");

    $this->mailer->send($email);
}
}