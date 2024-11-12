<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

#[ODM\Document]
class AnimalVisite
{
    #[ODM\Id]
    private string $id;

    #[ODM\Field]
    private int $animalId;

    #[ODM\Field]
    private string $visites;

    #[ODM\Field(type: 'string')]
    private string $nom = '';

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getAnimalId(): ?int
    {
        return $this->animalId;
    }

    public function setAnimalId(int $animalId): self
    {
        $this->animalId = $animalId;

        return $this;
    }

    public function getVisites(): ?int
    {
        return $this->visites;
    }

    public function setVisites(int $visites): self
    {
        $this->visites = $visites;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }
}
