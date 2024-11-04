<?php

namespace App\Form;

use App\Entity\Image;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ImageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nomImage', TextType::class, [
                'label' => 'Nom de l\'image'
            ])
            ->add('imagePath', FileType::class, [
                'label' => 'Fichier image',
                'required' => true,
                'mapped' => false,
            ])
            ->add('imageSubDirectory', TextType::class, [
                'label' => 'Sous-répertoire de l\'image',
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Image::class,
        ]);
    }
}
