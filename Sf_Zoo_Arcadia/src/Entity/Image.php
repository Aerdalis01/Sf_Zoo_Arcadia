<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $imagePath = null;

    #[ORM\Column(length: 255)]
    private ?string $imageSubDirectory = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?service $service = null;

    #[ORM\OneToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    private ?SousService $sousService = null;

    #[ORM\OneToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    private ?Animal $animal = null;

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

    public function getSousService(): ?SousService
    {
        return $this->sousService;
    }

    public function setSousService(?SousService $sousService): static
    {
        $this->sousService = $sousService;

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
