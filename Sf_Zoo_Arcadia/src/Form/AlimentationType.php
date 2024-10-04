<?php
namespace App\Form;

use App\Entity\Alimentation;
use App\Entity\Animal;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AlimentationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('date', DateType::class, [
                'widget' => 'single_text',
                'label' => 'Date'
            ])
            ->add('heure', TimeType::class, [
                'widget' => 'single_text',
                'label' => 'Heure'
            ])
            ->add('nourriture', TextType::class, [
                'label' => 'Nourriture'
            ])
            ->add('quantite', TextType::class, [
                'label' => 'Quantité'
            ])
            ->add('animal', EntityType::class, [
                'class' => Animal::class,
                'choice_label' => 'prenom', 
                'label' => 'Animal'
            ])
            ->add('createdBy', TextType::class, [
                'label' => 'Créé par'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Enregistrer'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Alimentation::class,
            'csrf_protection' => false,
        ]);
    }
}
