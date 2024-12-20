<?php

namespace App\Entity;

use App\Repository\AlimentationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AlimentationRepository::class)]
#[HasLifecycleCallbacks]
class Alimentation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['animal', 'alimentation'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['animal', 'alimentation'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['animal', 'alimentation'])]
    private ?\DateTimeInterface $heure = null;

    #[ORM\Column(length: 255)]
    #[Groups(['animal', 'alimentation'])]
    private ?string $nourriture = null;

    #[ORM\Column(length: 255)]
    #[Groups(['animal', 'alimentation'])]
    private ?string $quantite = null;

    #[ORM\ManyToOne(targetEntity: Animal::class, inversedBy: 'alimentation', fetch: 'EAGER')]
    #[Groups(['animal', 'alimentation'])]
    private ?Animal $animal = null;

    #[ORM\Column(length: 100)]
    #[Groups(['animal', 'alimentation'])]
    private ?string $createdBy = null;

    #[ORM\Column(type : 'boolean')]
    #[Groups(['animal', 'alimentation'])]
    private $isUsed = false;

    #[ORM\OneToOne(mappedBy: 'alimentation', targetEntity: AnimalReport::class, cascade: ['persist', 'remove'])]
    #[Groups(['animal', 'alimentation'])]
    private ?AnimalReport $animalReport = null;

    #[ORM\PrePersist]
    public function setDefaults(): void
    {
        $this->date = new \DateTimeImmutable();
        $this->heure = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getHeure(): ?\DateTimeInterface
    {
        return $this->heure;
    }

    public function setHeure(\DateTimeInterface $heure): static
    {
        $this->heure = $heure;

        return $this;
    }

    public function getNourriture(): ?string
    {
        return $this->nourriture;
    }

    public function setNourriture(string $nourriture): static
    {
        $this->nourriture = $nourriture;

        return $this;
    }

    public function getQuantite(): ?string
    {
        return $this->quantite;
    }

    public function setQuantite(string $quantite): static
    {
        $this->quantite = $quantite;

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

    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    public function setCreatedBy(string $createdBy): static
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getIsUsed(): bool
    {
        return $this->isUsed;
    }

    public function setIsUsed(bool $isUsed): self
    {
        $this->isUsed = $isUsed;

        return $this;
    }

    public function getAnimalReport(): ?AnimalReport
    {
        return $this->animalReport;
    }

    public function setAnimalReport(?AnimalReport $animalReport): static
    {
        $this->animalReport = $animalReport;

        return $this;
    }
}
