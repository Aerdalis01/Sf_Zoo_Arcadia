<?php

namespace App\Entity;

use App\Repository\ContactRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
class Contact
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('contact')]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups('contact')]
    private ?string $email = null;

    #[ORM\Column(length: 25)]
    #[Groups('contact')]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    #[Groups('contact')]
    private ?string $message = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups('contact')]
    private bool $isResponded = false;

    #[ORM\Column]
    #[Groups('contact')]
    private ?\DateTimeImmutable $sendAt = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups('contact')]
    private ?string $responseMessage = null;

    #[ORM\Column(nullable: true)]
    #[Groups('contact')]
    private ?\DateTimeImmutable $respondedAt = null;

    public function __construct()
    {
        $this->sendAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }


    public function isResponded(): bool
    {
        return $this->isResponded;
    }

    public function setIsResponded(bool $isResponded): static
    {
        $this->isResponded = $isResponded;

        return $this;
    }

    public function getSendAt(): ?\DateTimeImmutable
    {
        return $this->sendAt;
    }

    public function setSendAt(\DateTimeImmutable $sendAt): static
    {
        $this->sendAt = $sendAt;

        return $this;
    }

    public function getResponseMessage(): ?string
    {
        return $this->responseMessage;
    }

    public function setResponseMessage(?string $responseMessage): static
    {
        $this->responseMessage = $responseMessage;

        return $this;
    }

    public function getRespondedAt(): ?\DateTimeImmutable
    {
        return $this->respondedAt;
    }

    public function setRespondedAt(?\DateTimeImmutable $respondedAt): static
    {
        $this->respondedAt = $respondedAt;

        return $this;
    }
}
