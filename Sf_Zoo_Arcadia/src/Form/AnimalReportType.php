<?php

namespace App\Form;

use App\Entity\Alimentation;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AnimalReportType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('commentaireEtat', TextareaType::class, [
                'label' => 'Commentaire sur l\'état de l\'animal',
                'required' => false,
            ])
            ->add('animaux', EntityType::class, [
                'class' => Alimentation::class,
                'choice_label' => function (Alimentation $rapport) {
                    return sprintf('Animal: %s, Nourriture: %s (%s kg), Date: %s, Heure: %s', 
                        $rapport->getAnimal()->getnom(), 
                        $rapport->getNourriture(), 
                        $rapport->getQuantite(),
                        $rapport->getDate()->format('d/m/Y'),
                        $rapport->getHeure()->format('H:i'),
                        $rapport->getCreatedBy()
                    );
                },
                'label' => 'Rapport d\'alimentation associé',
                'placeholder' => 'Sélectionnez un rapport d\'alimentation',
                'required' => true,
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Enregistrer le compte rendu'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => AnimalReport::class,
        ]);
    }
}
