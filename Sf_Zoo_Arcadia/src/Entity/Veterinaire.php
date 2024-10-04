<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Veterinaire extends User
{
    /**
     * @var Collection<int, AnimalReport>
     */
    #[ORM\OneToMany(targetEntity: AnimalReport::class, mappedBy: 'veterinaire')]
    private Collection $animalReport;

    public function __construct()
    {
        parent::__construct();
        $this->setRoles(['ROLE_VETERINAIRE']);
        $this->animalReport = new ArrayCollection();
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
            $animalReport->setVeterinaire($this);
        }
        
        return $this;
    }

    public function removeAnimalReport(AnimalReport $animalReport): static
    {
        if ($this->animalReport->removeElement($animalReport)) {
            // set the owning side to null (unless already changed)
            if ($animalReport->getVeterinaire() === $this) {
                $animalReport->setVeterinaire(null);
            }
        }

        return $this;
    }
}