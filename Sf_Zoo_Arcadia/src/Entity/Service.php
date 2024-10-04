<?php

namespace App\Entity;

use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $nom = null;

    #[ORM\Column(length: 25, nullable: true)]
    private ?string $titre = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $horaire = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $carteZooPath = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Image $image = null;


    #[ORM\Column(nullable: true)]
    #[ORM\OneToMany(targetEntity: SousService::class, mappedBy: 'service')]
    private Collection $sousService;

    public function __construct()
    {
        $this->sousService = new ArrayCollection();
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

    public function getHoraire(): ?string
    {
        return $this->horaire;
    }

    public function setHoraire(?string $horaire): static
    {
        $this->horaire = $horaire;

        return $this;
    }

    public function getCarteZooPath(): ?string
    {
        return $this->carteZooPath;
    }

    public function setCarteZooPath(?string $carteZooPath): static
    {
        $this->carteZooPath = $carteZooPath;

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

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): static
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return Collection<int, SousService>
     */
    public function getSousService(): Collection
    {
        return $this->sousService;
    }

    public function addSousService(SousService $sousService): static
    {
        if (!$this->sousService->contains($sousService)) {
            $this->sousService->add($sousService);
            $sousService->setService($this);
        }

        return $this;
    }

    public function removeSousService(SousService $sousService): static
    {
        if ($this->sousService->removeElement($sousService)) {
            // set the owning side to null (unless already changed)
            if ($sousService->getService() === $this) {
                $sousService->setService(null);
            }
        }

        return $this;
    }
}
