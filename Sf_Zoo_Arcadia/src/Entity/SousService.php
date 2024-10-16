<?php

namespace App\Entity;

use App\Repository\SousServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SousServiceRepository::class)]
#[ORM\HasLifecycleCallbacks]
class SousService
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('sousService_basic')]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    #[Groups('sousService_basic')]
    private ?string $nom = null;

    #[Groups('sousService_basic')]
    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(type: "boolean")]
    #[Groups('sousService_basic')]
    private  $menu = false;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'sousService')]
    #[Groups('sousService_basic')]

    private ?Service $service = null;

    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'sousService')]
    #[Groups('sousService_basic')]

    private Collection $image;

    public function __construct()
    {
        $this->image = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function setMenu(bool $menu): static
    {
        $this->menu = $menu;
        return $this;
    }
    public function getMenu(): ?bool
    {
        return $this->menu;
    }

    public function isMenu(): bool
    {
        return $this->menu;
    }
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
    

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImage(): Collection
    {
        return $this->image;
    }

    public function addImage(Image $image): static
    {
        if (!$this->image->contains($image)) {
            $this->image->add($image);
            $image->setSousService($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->image->contains($image)) {
            $this->image->removeElement($image);
            if ($image->getSousService() === $this) {
                $image->setSousService(null);
            }
        }

        return $this;
    }
}
