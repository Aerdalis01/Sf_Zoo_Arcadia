<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['habitat', 'animal'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['habitat', 'animal'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['habitat', 'animal'])]
    private ?string $imagePath = null;

    #[ORM\Column(length: 255)]
    #[Groups(['habitat', 'animal'])]
    private ?string $imageSubDirectory = null;

    #[ORM\OneToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Service $service = null;

    #[ORM\OneToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    private ?Animal $animal = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: false)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    private ?SousService $sousService = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Habitat $habitat = null;

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAt(): void
    {
        if ($this->createdAt !== null) {
            $this->updatedAt = new \DateTimeImmutable();
        }
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

    public function getImagePath(): ?string
    {
        return $this->imagePath;
    }

    public function setImagePath(string $imagePath): static
    {
        $this->imagePath = $imagePath;

        return $this;
    }

    public function getImageSubDirectory(): ?string
    {
        return $this->imageSubDirectory;
    }

    public function setImageSubDirectory(string $imageSubDirectory): static
    {
        $this->imageSubDirectory = $imageSubDirectory;

        return $this;
    }

    public function getService(): ?service
    {
        return $this->service;
    }

    public function setService(?service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getHabitat(): ?habitat
    {
        return $this->habitat;
    }

    public function setHabitat(?habitat $habitat): static
    {
        $this->habitat = $habitat;

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getSousService(): ?SousService
    {
        return $this->sousService;
    }

    public function setSousService(?SousService $sousService): static
    {
        $this->sousService = $sousService;

        return $this;
    }
}
