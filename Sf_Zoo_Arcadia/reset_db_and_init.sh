#!/bin/bash


php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate


php bin/console app:initialize-admin


php bin/console doctrine:fixtures:load --append
