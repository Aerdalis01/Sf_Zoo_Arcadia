<?php

namespace App\Entity;

use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: ServiceRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('service_basic')]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    #[Groups('service_basic')]
    private ?string $nom = null;

    #[ORM\Column(length: 25, nullable: true)]
    #[Groups('service_basic')]
    private ?string $titre = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('service_basic')]
    private ?string $description = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups('service_basic')]
    private ?string $horaire = null;

    #[ORM\Column(type: "boolean")]
    #[Groups('service_basic')]
    private  $carteZoo = false;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToOne(mappedBy: 'service', cascade: ['persist', 'remove'])]
    #[Groups('service_basic')]
    private ?Image $image = null;
    
    #[ORM\OneToMany(targetEntity: SousService::class, mappedBy: 'service', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: "CASCADE")]
    private Collection $sousServices;

    public function __construct()
    {
        $this->sousServices = new ArrayCollection();
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

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(?string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getHoraire(): ?array
{
    return $this->horaire ? json_decode($this->horaire, true) : null;
}

    public function setHoraire(?string $horaire): static
    {
        $this->horaire = $horaire;

        return $this;
    }

    public function setCarteZoo(bool $carteZoo): self
    {
        $this->carteZoo = $carteZoo;
        return $this;
    }

    public function isCarteZoo(): bool
    {
        return $this->carteZoo;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
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
    public function removeImage(): static
{
    
    if ($this->image !== null) {
        $this->image->setService(null);
        $this->image = null;
    }

    return $this;
}
    /**
     * @return Collection<int, SousService>
     */
    public function getSousService(): Collection
    {
        return $this->sousServices;
    }

    public function addSousService(SousService $sousService): static
    {
        if (!$this->sousServices->contains($sousService)) {
            $this->sousServices->add($sousService);
            $sousService->setService($this);
        }

        return $this;
    }

    public function removeSousService(SousService $sousService): static
    {
        if ($this->sousServices->removeElement($sousService)) {
            // set the owning side to null (unless already changed)
            if ($sousService->getService() === $this) {
                $sousService->setService(null);
            }
        }

        return $this;
    }
}
