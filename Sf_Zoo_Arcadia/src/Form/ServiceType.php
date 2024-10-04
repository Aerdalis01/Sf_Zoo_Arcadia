<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Entity\Service;
use App\Entity\Image;

class ServiceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom', TextType::class, [
                'label' => 'Nom',
            ])
            ->add('titre', TextType::class,[
                'label' => 'Titre',
                'required' => false,
            ])
            ->add('description', TextType::class, [
                'label' => 'Description',
                'required' => false,
            ]);


        if ($options['include_image']) {
            $builder->add('images', EntityType::class, [
                'class' => Image::class,
                'choice_label' => 'nom',
                'label' => 'Image',
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ]);
        }


        if ($options['is_sous_service']) {
            $builder->add('service', EntityType::class, [
                'class' => Service::class,
                'choice_label' => 'nom',
                'label' => 'Service associé',
                'required' => false
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null, 
            'is_sous_service' => false, 
            'include_images' => true, 
        ]);
    }
}
