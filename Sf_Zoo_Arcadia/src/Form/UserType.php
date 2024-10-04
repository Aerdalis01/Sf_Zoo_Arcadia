<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('email', EmailType::class, [
            'label' => 'Email',
            'constraints' => [
                new \Symfony\Component\Validator\Constraints\Email([
                    'message' => 'Please enter a valid email address.',
                ]),
            ],
        ])
        ->add('password', PasswordType::class, [
            'label' => 'Password',
            'required' => true,
        ])
        ->add('role', ChoiceType::class, [
            'choices' => [
                'Employe' => 'employe',
                'Veterinaire' => 'veterinaire',
            ],
            'label' => 'Role',
        ])
        ->add('save', SubmitType::class, [
            'label' => 'Save',
        ]);
}

public function configureOptions(OptionsResolver $resolver): void
{
    $resolver->setDefaults([
        'data_class' => User::class,
    ]);
}
}