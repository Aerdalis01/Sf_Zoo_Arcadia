<?php

namespace App\Entity;

use App\Repository\HabitatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HabitatRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Habitat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('habitat', 'animal')]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    #[Groups('habitat', 'animal')]
    private ?string $nom = null;

    #[ORM\Column(type: 'text')]
    #[Groups('habitat', 'animal')]
    private ?string $description = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(targetEntity: HabitatComment::class, mappedBy: 'habitat')]
    #[Groups('habitat', 'animal')]
    private Collection $habitatComments;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups('habitat', 'animal')]
    private ?Image $image = null;

    #[ORM\OneToMany(targetEntity: Animal::class, mappedBy: 'habitat', cascade: ['remove'], orphanRemoval: true, fetch: 'EAGER')]
    #[Groups('habitat', 'animal')]
    private Collection $animals;

    public function __construct()
    {
        $this->habitatComments = new ArrayCollection();
        $this->animals = new ArrayCollection();
    }

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getHabitatComment(): Collection
    {
        return $this->habitatComments;
    }

    public function addHabitatComment(HabitatComment $habitatComment): static
    {
        if (!$this->habitatComments->contains($habitatComment)) {
            $this->habitatComments->add($habitatComment);
            $habitatComment->setHabitat($this);
        }

        return $this;
    }

    public function removeHabitatComment(HabitatComment $habitatComment): static
    {
        if ($this->habitatComments->removeElement($habitatComment)) {
            if ($habitatComment->getHabitat() === $this) {
                $habitatComment->setHabitat(null);
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

    public function getAnimals(): Collection
    {
        return $this->animals;
    }

    public function addAnimal(Animal $animal): static
    {
        if (!$this->animals->contains($animal)) {
            $this->animals->add($animal);
            $animal->setHabitat($this);
        }

        return $this;
    }

    public function removeAnimal(Animal $animal): static
    {
        if ($this->animals->removeElement($animal)) {
            if ($animal->getHabitat() === $this) {
                $animal->setHabitat(null);
            }
        }

        return $this;
    }
}
