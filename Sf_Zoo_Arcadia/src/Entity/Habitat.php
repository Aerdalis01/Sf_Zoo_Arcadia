<?php

namespace App\Entity;

use App\Repository\HabitatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HabitatRepository::class)]
class Habitat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'HabitatComment')]
    private ?self $HabitatComment = null;

    #[ORM\OneToMany(targetEntity: HabitatComment::class, mappedBy: 'habitat')]
    private Collection $habitatComment;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Image $image = null;


    #[ORM\OneToMany(targetEntity: Animal::class, mappedBy: 'habitat')]
    private Collection $animal;

    public function __construct()
    {
        $this->HabitatComment = new ArrayCollection();
        $this->habitatComment = new ArrayCollection();
        $this->animal = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

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

    public function getHabitatComment(): ?self
    {
        return $this->HabitatComment;
    }

    public function setHabitatComment(?self $HabitatComment): static
    {
        $this->HabitatComment = $HabitatComment;

        return $this;
    }

    public function addHabitatComment(self $habitatComment): static
    {
        if (!$this->habitatComment->contains($habitatComment)) {
            $this->habitatComment->add($habitatComment);
            $habitatComment->setHabitatComment($this);
        }

        return $this;
    }

    public function removeHabitatComment(self $habitatComment): static
    {
        if ($this->habitatComment->removeElement($habitatComment)) {
            if ($habitatComment->getHabitatComment() === $this) {
                $habitatComment->setHabitatComment(null);
            }
        }

        return $this;
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): static
    {
        $this->image = $image;

        return $this;
    }


    public function getAnimal(): Collection
    {
        return $this->animal;
    }

    public function addAnimal(Animal $animal): static
    {
        if (!$this->animal->contains($animal)) {
            $this->animal->add($animal);
            $animal->setHabitat($this);
        }

        return $this;
    }

    public function removeAnimal(Animal $animal): static
    {
        if ($this->animal->removeElement($animal)) {
            if ($animal->getHabitat() === $this) {
                $animal->setHabitat(null);
            }
        }

        return $this;
    }
}
