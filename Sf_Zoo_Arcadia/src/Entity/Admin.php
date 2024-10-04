<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Admin extends User 
{
    public function getRoles(): array
    {
        return ['ROLE_ADMIN'];
    }
    
}