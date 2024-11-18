#!/bin/bash


php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

php bin/console doctrine:mongodb:schema:drop
php bin/console doctrine:mongodb:schema:create


php bin/console doctrine:fixtures:load --append
php bin/console doctrine:mongodb:fixtures:load

php bin/console app:initialize-admin

mongod


