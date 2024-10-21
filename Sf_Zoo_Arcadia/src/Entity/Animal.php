<?php

namespace App\Entity;

use App\Repository\AnimalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnimalRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Animal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('animal')]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    #[Groups('animal')]
    private ?string $nom = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'animal')]
    #[Groups('animal')]
    private ?Habitat $habitat = null;

    #[ORM\OneToMany(targetEntity: Alimentation::class, mappedBy: 'animal')]
    #[Groups('animal')]
    private Collection $alimentation;

    #[ORM\ManyToOne(inversedBy: 'animal')]
    #[Groups('animal')]
    private ?Race $race = null;

    #[ORM\OneToMany(targetEntity: AnimalReport::class, mappedBy: 'animal')]
    #[Groups('animal')]
    private Collection $animalReport;

    #[ORM\OneToOne(mappedBy: 'animal', cascade: ['persist', 'remove'])]
    #[Groups('animal')]
    private ?Image $image = null;

    public function __construct()
    {
        $this->alimentation = new ArrayCollection();
        $this->animalReport = new ArrayCollection();
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

    /**
     * @return Collection<int, AnimalReport>
     */
    public function getAnimalReport(): Collection
    {
        return $this->animalReport;
    }

    public function addAnimalReport(AnimalReport $animalReport): static
    {
        if (!$this->animalReport->contains($animalReport)) {
            $this->animalReport->add($animalReport);
            $animalReport->setAnimal($this);
        }

        return $this;
    }

    public function removeAnimalReport(AnimalReport $animalReport): static
    {
        if ($this->animalReport->removeElement($animalReport)) {
            // set the owning side to null (unless already changed)
            if ($animalReport->getAnimal() === $this) {
                $animalReport->setAnimal(null);
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
