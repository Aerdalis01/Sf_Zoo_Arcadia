# Sf_Zoo_Arcadia

## Introduction
Zoo Arcadia est une application de gestion d’un zoo, permettant de gérer les habitats, les animaux et leurs régimes alimentaires. Cette application est construite en utilisant un stack PHP pour le back-end avec Symfony et un stack JavaScript moderne pour le front-end, comprenant TypeScript et React.

## Pré-requis

### Backend :
- **PHP** : >=8.0.2 (Requis pour Symfony 6.x)
- **Symfony** : 6.x (Version LTS maintenue)
- **Doctrine ORM** : ^2.8 (Gestion des bases de données avec MySQL)
- **Composer** : 2.x ou supérieur (Gestionnaire de dépendances PHP)
- **MySQL** : (ou tout autre gestionnaire de base de données relationnel compatible)
- **MongoDB** : Base de donnée non relationnel

### Frontend :
- **Node.js** : 12.x ou supérieur (Pour le build des assets front-end)
- **NPM** : 6.x ou supérieur (Gestionnaire de paquets pour le front-end)
- **Sass** et **Bootstrap** (Préprocesseur CSS et framework pour l'interface utilisateur)
- **TypeScript** (Langage pour le développement front-end)
- **React** et **React-DOM** (Bibliothèques JavaScript pour construire les interfaces utilisateurs)
- **Webpack Encore** (Bundle pour gérer les assets)

## Commandes d'installation

### Backend :

1. **Créer un projet Symfony** :
   ```bash
  composer create-project symfony/skeleton Sf_Zoo_Arcadia

2. **Se déplacer dans le répertoir du projet:** :
  ```bash
  cd Sf_Zoo_Arcadia

3. **Installer les composants Symfony nécessaires** :
  ```bash
  composer require symfony/asset symfony/form symfony/security-bundle symfony/validator

4. **Installer Doctrine ORM** :
  ```bash
  composer require symfony/orm-pack

5. **Installer Webpack Encore** :
  ```bash
  composer require symfony/webpack-encore-bundle

6. **Installer Doctrine MongoDB** :
    ```bash
    composer require doctrine/mongodb-odm-bundle



note : pour l'authetification:
dans php ini décomenter extension=sodium
composer require lcobucci/jwt
composer require firebase/php-jwt
npm install zod
### Frontend :

1. **Initialiser NPM (créer package.json)** :
  ```bash
    npm init -y

2. **Installer Sass et Webpack Encore** :
  ```bash
  npm install sass-loader sass --save-dev

3. **Installer Bootstrap** :
  ```bash
  npm install bootstrap

4. **Installer TypeScript et le support Webpack** :
  ```bash
  npm install typescript ts-loader --save-dev

5. **Installer React et React-DOM** :
  ```bash
  npm install react react-dom --save

6. **Support React pour Webpack Encore** :
  ```bash
  npm install @babel/preset-react --save-dev

7. **Installer Babel** :
  ```bash
  npm install @babel/core @babel/preset-env babel-loader --save-dev

### Installation de MongoDB

1. Télécharge MongoDB Community Server depuis le site officiel : [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Suis les instructions d'installation pour ton système d'exploitation.
3. Une fois installé, vérifie que MongoDB fonctionne en lançant la commande suivante :
    ```bash
    mongo --version

### Configuration du serveur local avec XAMPP

1. **Démarrer Apache et MySQL avec XAMPP**
  Ouvrir XAMPP et démarrer Apache et MySQL en cliquant sur les boutons "Start" correspondants dans le panneau de contrôle.

2. **Configurer un Virtual Host pour Symfony**

  A. **Ouvrir le fichier de configuration des Virtual Hosts : Le fichier de configuration des Virtual Hosts est généralement situé ici** :
    C:/xampp/apache/conf/extra/httpd-vhosts.conf

  B. **Ajouter un Virtual Host pour Symfony : Ouvre le fichier "httpd-vhosts.conf" et ajoute le bloc de configuration suivant**

    <VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot "C:/Environnement/Workspace/Sf_Zoo_Arcadia/public"
    ServerName symfony.local
    ErrorLog "logs/symfony-error.log"
    CustomLog "logs/symfony-access.log" common
    <Directory "C:/Environnement/Workspace/Sf_Zoo_Arcadia/public">
        AllowOverride None
        Order Allow,Deny
        Allow from All
        FallbackResource /index.php
    </Directory>
</VirtualHost>

* DocumentRoot : Le chemin absolu vers le dossier public de ton projet Symfony.
* ServerName : Le nom du domaine local que tu utiliseras (par exemple, symfony.local).

3. **Modifier le fichier hosts** :

  A.**Ouvrir le fichier hosts : Sur Windows, le fichier hosts se trouve ici** :

  * C:\Windows\System32\drivers\etc\hosts

  B. **Ajouter la ligne suivante** :

  * 127.0.0.1 symfony.local

4. **Accéder à ton projet via le navigateur** :

  * http://symfony.local

### Compilation des assets front-end

Le point d'entrée principal de l'application front-end est défini dans `assets/app.tsx`. Ce fichier gère l'application React, et tous les composants et services front-end sont inclus à partir de ce fichier.


Pour compiler les assets front-end :

1. **Créer un fichier de configuration Webpack Encore (si ce n'est pas déjà fait)** :
  ```bash
  npm run encore dev --watch

2. **Compiler les fichiers avec Webpack Encore en mode développement** :
  ```bash
  npm run dev

3. **Compiler les fichiers avec Webpack Encore en mode production :** :
  ```bash
    npm run build


### Configuration des variables d'environnement

Symfony utilise des fichiers `.env` pour configurer les variables d'environnement telles que la base de données, les secrets de l'application, etc.

1. **Fichier `.env`** :
   Un fichier `.env` est généré par défaut lors de l'installation de Symfony. Ce fichier contient les variables d'environnement par défaut pour l'application, comme `APP_ENV`, `APP_SECRET`, et `DATABASE_URL`.

   Voici un exemple des variables présentes dans le fichier `.env` :

    ```env
    APP_ENV=dev
    APP_SECRET=your_secret_key_here
    DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0"
    MONGODB_URL="mongodb://localhost:27017/sf_zoo_arcadia"
    
Il est recommandé de personnaliser ces variables en fonction de votre environnement.

2. **Fichier .env.local : Pour les variables sensibles ou spécifiques à votre environnement local, vous pouvez créer un fichier .env.local qui ne sera pas versionné.**

Par exemple, pour configurer la connexion à la base de données localement, vous pourriez utiliser :

    ```env
    DATABASE_URL="mysql://ZooAdmin:your_password@127.0.0.1:3306/sf_zoo_arcadia?serverVersion=mariadb-10.5.8"
    ```

Note : Le fichier .env.local est ignoré par Git et ne doit pas être partagé avec d'autres développeurs.

### Gestion des styles

Les styles CSS de l'application sont gérés via **Sass**. Les fichiers Sass se trouvent dans le répertoire `assets/`, et Webpack Encore est configuré pour les compiler en CSS.

Lors de la compilation des assets, les fichiers `.sass` sont transformés en `.css` et placés dans le répertoire `public/build`.

## Technologies utilisées
- **PHP** : >=8.0.2
- **Symfony** : 6.x (Version LTS)
- **Doctrine ORM** : ^2.8
- **MySQL** : (Base de données)
- **Node.js** : 12.x ou supérieur
- **Composer** : 2.x ou supérieur
- **NPM** : 6.x ou supérieur
- **Sass** et **Bootstrap**
- **TypeScript**
- **React** et **React-DOM**
- **Webpack Encore** (Gestionnaire d'assets)

---

## Structure du projet

Le projet est structuré de manière à séparer le back-end (Symfony et PHP) et le front-end (TypeScript et React), tout en assurant une intégration fluide à travers Webpack Encore pour gérer les assets (CSS, JavaScript).

