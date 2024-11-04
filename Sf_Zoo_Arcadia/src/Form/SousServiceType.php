<?php

namespace App\Form;

use App\Entity\SousService;
use App\Entity\Image;
use App\Entity\Service;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SousServiceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom', TextType::class, [
                'label' => 'Nom du Sous-Service',
            ])
            ->add('description', TextType::class, [
                'label' => 'Description',
            ])
            ->add('services_nom', EntityType::class, [
                'class' => Service::class,
                'choice_label' => 'nomService',
                'label' => 'Service associé'
            ])
            ->add('images', EntityType::class, [
                'class' => Image::class,
                'choice_label' => 'nom',
                'label' => 'Images',
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SousService::class,
        ]);
    }
}
