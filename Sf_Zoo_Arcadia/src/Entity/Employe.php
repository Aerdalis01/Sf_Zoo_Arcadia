<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Employe extends User
{

    // #[ORM\OneToMany(targetEntity: RapportAlimentation::class, mappedBy: 'employe')]
    // private Collection $rapportAlimentations;


    // #[ORM\OneToMany(targetEntity: Avis::class, mappedBy: 'employe')]
    // private Collection $avis;

    // #[ORM\OneToMany(targetEntity: Contact::class, mappedBy: 'employe')]
    // private Collection $contacts;



    public function __construct()
    {
        parent::__construct();
        $this->setRoles(['ROLE_EMPLOYE']);
        // $this->rapportAlimentations = new ArrayCollection();
        // $this->avis = new ArrayCollection();
        // $this->contacts = new ArrayCollection();
    }

    // /**
    //  * @return Collection<int, RapportAlimentation>
    //  */
    // public function getRapportAlimentations(): Collection
    // {
    //     return $this->rapportAlimentations;
    // }

    // public function addRapportAlimentation(RapportAlimentation $rapportAlimentation): static
    // {
    //     if (!$this->rapportAlimentations->contains($rapportAlimentation)) {
    //         $this->rapportAlimentations->add($rapportAlimentation);
    //         $rapportAlimentation->setEmploye($this);
    //     }

    //     return $this;
    // }

    // public function removeRapportAlimentation(RapportAlimentation $rapportAlimentation): static
    // {
    //     if ($this->rapportAlimentations->removeElement($rapportAlimentation)) {
    //         if ($rapportAlimentation->getEmploye() === $this) {
    //             $rapportAlimentation->setEmploye(null);
    //         }
    //     }

    //     return $this;
    // }

    // /**
    //  * @return Collection<int, Avis>
    //  */
    // public function getAvis(): Collection
    // {
    //     return $this->avis;
    // }

    // public function addAvis(Avis $avis): static
    // {
    //     if (!$this->avis->contains($avis)) {
    //         $this->avis->add($avis);
    //         $avis->setEmploye($this);
    //     }

    //     return $this;
    // }

    // public function removeAvis(Avis $avis): static
    // {
    //     if ($this->avis->removeElement($avis)) {
    //         if ($avis->getEmploye() === $this) {
    //             $avis->setEmploye(null);
    //         }
    //     }

    //     return $this;
    // }

    // public function validerAvis(Avis $avis): void
    // {
    // if($avis->getEmploye() === $this) {
    //     $avis->setValide(true);
    // }
    // }
    // public function invaliderAvis(Avis $avis): void
    // {
    // if($avis->getEmploye() === $this) {
    //     $avis->setValide(false);
    // }
    // }

    // /**
    //  * @return Collection<int, Contact>
    //  */
    // public function getContacts(): Collection
    // {
    //     return $this->contacts;
    // }

    // public function addContact(Contact $contact): static
    // {
    //     if (!$this->contacts->contains($contact)) {
    //         $this->contacts->add($contact);
    //         $contact->setEmploye($this);
    //     }

    //     return $this;
    // }

    // public function removeContact(Contact $contact): static
    // {
    //     if ($this->contacts->removeElement($contact)) {
    //         // set the owning side to null (unless already changed)
    //         if ($contact->getEmploye() === $this) {
    //             $contact->setEmploye(null);
    //         }
    //     }

    //     return $this;
    // }

    // public function repondreContact(Contact $contact, string $reponse): void
    // {
    //     if ($this->contacts->contains($contact)) {
    //         // Envoyer un email de réponse (logique d'envoi d'email ici)
    //         $this->envoyerEmail($contact->getEmail(), $reponse);
    //     }
    // }

    private function envoyerEmail(string $email, string $reponse): void
    {
        // Logique d'envoi d'email (peut utiliser SwiftMailer, Symfony Mailer, etc.)
        // Exemple simplifié :
        mail($email, 'Réponse à votre contact', $reponse);
    }

}