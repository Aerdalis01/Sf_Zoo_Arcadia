<?php

namespace App\Entity;

use App\Repository\CarouselSlideRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CarouselSlideRepository::class)]
class CarouselSlide
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $imageLarge = null;

    #[ORM\Column(length: 255)]
    private ?string $imageMedium = null;

    #[ORM\Column(length: 255)]
    private ?string $imageSmall = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(targetEntity: Carousel::class, inversedBy: 'carouselSlides')]
    private ?Carousel $carousel = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImageLarge(): ?string
    {
        return $this->imageLarge;
    }

    public function setImageLarge(string $imageLarge): static
    {
        $this->imageLarge = $imageLarge;

        return $this;
    }

    public function getImageMedium(): ?string
    {
        return $this->imageMedium;
    }

    public function setImageMedium(string $imageMedium): static
    {
        $this->imageMedium = $imageMedium;

        return $this;
    }

    public function getImageSmall(): ?string
    {
        return $this->imageSmall;
    }

    public function setImageSmall(string $imageSmall): static
    {
        $this->imageSmall = $imageSmall;

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

    public function getCarousel(): ?Carousel
    {
        return $this->carousel;
    }

    public function setCarousel(?Carousel $carousel): static
    {
        $this->carousel = $carousel;

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
}
