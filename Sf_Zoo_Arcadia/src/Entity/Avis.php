<?php

namespace App\Entity;

use App\Repository\AvisRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;

#[ORM\Entity(repositoryClass: AvisRepository::class)]
#[HasLifecycleCallbacks]
class Avis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('avis')]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    #[Groups('avis')]
    private ?string $nom = null;

    #[ORM\Column(length: 50)]
    #[Groups('avis')]
    private ?string $avis = null;

    #[ORM\Column]
    #[Groups('avis')]
    private ?int $note = null;

    #[ORM\Column]
    #[Groups('avis')]
    private ?bool $valid = null;

    #[ORM\Column]
    #[Groups('avis')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getAvis(): ?string
    {
        return $this->avis;
    }

    public function setAvis(string $avis): static
    {
        $this->avis = $avis;

        return $this;
    }

    public function getNote(): ?int
    {
        return $this->note;
    }

    public function setNote(int $note): static
    {
        $this->note = $note;

        return $this;
    }

    public function isValid(): ?bool
    {
        return $this->valid;
    }

    public function setValid(bool $valid): static
    {
        $this->valid = $valid;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

}
