<?php

namespace App\Entity;

use App\Repository\AnimalReportRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AnimalReportRepository::class)]
#[ORM\HasLifecycleCallbacks]
class AnimalReport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['animal', 'animalReport', 'habitat'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['animal', 'animalReport', 'habitat'])]
    private ?string $etat = null;

    #[ORM\Column]
    #[Groups(['animal', 'animalReport', 'habitat'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 100)]
    #[Groups(['animal', 'animaReport', 'habitat'])]
    private ?string $createdBy = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['animal', 'animaReport', 'habitat'])]
    private ?Alimentation $alimentation = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['animal', 'animaReport', 'habitat'])]
    private ?string $etatDetail = null;

    #[ORM\ManyToOne(inversedBy: 'animalReport')]
    private ?Animal $animal = null;

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    public function setCreatedBy(string $createdBy): static
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getAlimentation(): ?Alimentation
    {
        return $this->alimentation;
    }

    public function setAlimentation(?Alimentation $alimentation): static
    {
        $this->alimentation = $alimentation;

        return $this;
    }

    public function getEtatDetail(): ?string
    {
        return $this->etatDetail;
    }

    public function setEtatDetail(?string $etatDetail): static
    {
        $this->etatDetail = $etatDetail;

        return $this;
    }

    public function getAnimal(): ?Animal
    {
        return $this->animal;
    }

    public function setAnimal(?Animal $animal): static
    {
        $this->animal = $animal;

        return $this;
    }
}
