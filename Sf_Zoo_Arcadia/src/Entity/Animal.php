<?php

namespace App\Entity;

use App\Repository\AnimalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AnimalRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Animal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['animal', 'alimentation', 'habitat'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['animal', 'alimentation', 'habitat'])]
    private ?string $nom = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: Habitat::class, inversedBy: 'animals')]
    #[Groups('animal')]
    private ?Habitat $habitat = null;

    #[ORM\OneToMany(targetEntity: Alimentation::class, mappedBy: 'animal')]
    #[Groups('animal', 'habitat')]
    private Collection $alimentation;

    #[ORM\ManyToOne(inversedBy: 'animals')]
    #[Groups(['animal', 'habitat'])]
    private ?Race $race = null;

    #[ORM\OneToOne(mappedBy: 'animal', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['animal', 'habitat'])]
    private ?Image $image = null;

    public function __construct()
    {
        $this->alimentation = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAt(): void
    {
        if ($this->createdAt !== null) {  // Vérifie que l'entité n'est pas nouvellement créée
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getHabitat(): ?Habitat
    {
        return $this->habitat;
    }

    public function setHabitat(?Habitat $habitat): static
    {
        $this->habitat = $habitat;

        return $this;
    }

    public function getAlimentation(): Collection
    {
        return $this->alimentation;
    }

    public function addAlimentation(Alimentation $alimentation): static
    {
        if (!$this->alimentation->contains($alimentation)) {
            $this->alimentation->add($alimentation);
            $alimentation->setAnimal($this);
        }

        return $this;
    }

    public function removeAlimentation(Alimentation $alimentation): static
    {
        if ($this->alimentation->removeElement($alimentation)) {
            if ($alimentation->getAnimal() === $this) {
                $alimentation->setAnimal(null);
            }
        }

        return $this;
    }

    public function getRace(): ?Race
    {
        return $this->race;
    }

    public function setRace(?Race $race): static
    {
        $this->race = $race;

        return $this;
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): static
    {
        // unset the owning side of the relation if necessary
        if ($image === null && $this->image !== null) {
            $this->image->setAnimal(null);
        }

        // set the owning side of the relation if necessary
        if ($image !== null && $image->getAnimal() !== $this) {
            $image->setAnimal($this);
        }

        $this->image = $image;

        return $this;
    }
}
