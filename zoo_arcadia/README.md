## Lien du dépôt git: 
  git clone https://github.com/Aerdalis01/Sf_Zoo_Arcadia.git

## 1.Environnement de travail

### Backend :
- **PHP** : >=8.2 
- **Symfony CLI** 
- **Doctrine ORM** : ^3.2
- **Composer** : 2.x ou supérieur (Gestionnaire de dépendances PHP)
- **MySQL** : (ou tout autre gestionnaire de base de données relationnel compatible)
- **MongoDB** : Base de donnée non relationnel

### Frontend :
- **Node.js** : 22.9 ou supérieur (Pour le build des assets front-end)
- **NPM** : 6.x ou supérieur (Gestionnaire de paquets pour le front-end)
- **Sass** et **Bootstrap** (Préprocesseur CSS et framework pour l'interface utilisateur)
- **TypeScript** (Langage pour le développement front-end)
- **React** et **React-DOM** (Bibliothèques JavaScript pour construire les interfaces utilisateurs)
- **Webpack Encore** (Bundle pour gérer les assets)

## Commandes d'installation
1.**Se déplacer dans le bon répertoire**
    ```bash
      cd Sf_Zoo_Arcadia/Sf_Zoo_Arcadia
2. **Créer un projet Symfony** :
   ```bash
      composer create-project symfony/skeleton Sf_Zoo_Arcadia

3. **Se déplacer dans le répertoir du projet:** :
  ```bash
  cd Sf_Zoo_Arcadia

4. **Installer les composants Symfony nécessaires** :
  ```bash
  composer require symfony/asset symfony/form symfony/security-bundle symfony/validator

5. **Installer Doctrine ORM** :
  ```bash
  composer require symfony/orm-pack

6. **Installer les dépendances symfony**
  ```bash
  composer require symfony/maker-bundle --dev

7. **Installer Webpack Encore** :
  ```bash
  composer require symfony/webpack-encore-bundle

8. **Installer les dépendances Webpack**
  ```bash
  npm install webpack-notifier@^1.15.0 --save-dev

9. **Installer Doctrine MongoDB** :
    ```bash
    composer require doctrine/mongodb-odm-bundle 
10. **Installer Firebase**
  ```bash
  composer require firebase/php-jwt


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
8. **Installer Zod pour React**
npm install zod

### Installation de MongoDB

1. Télécharge MongoDB Community Server depuis le site officiel : [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Suis les instructions d'installation pour ton système d'exploitation.
3. Une fois installé, vérifie que MongoDB fonctionne en lançant la commande suivante :
    ```bash
    mongo --version

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
APP_ENV=dev
APP_SECRET=your_app_secret_here

REACT_APP_API_BASE_URL=https://arcadiabroceliande.com
DATABASE_URL=mysql://<user>:<password>@127.0.0.1:3306/<database_name>
MONGODB_URL=mongodb://<user>:<password>@127.0.0.1:27017   
MAILER_DSN="smtp://zoo@arcadiabroceliande.com:ekdLeof20%24AZD8@smtp.hostinger.com:465?encryption=ssl"

MAILER_FROM_EMAIL=zoo@arcadiabroceliande.com

ADMIN_EMAIL=josearcadia98@gmail.com
ADMIN_ROLE=ROLE_ADMIN

ZOO_EMAIL=zoo@arcadiabroceliande.com  

Note : Le fichier .env.local est ignoré par Git et ne doit pas être partagé avec d'autres développeurs.

### Gestion des styles

Les styles CSS de l'application sont gérés via **Sass**. Les fichiers Sass se trouvent dans le répertoire `assets/`, et Webpack Encore est configuré pour les compiler en CSS.

Lors de la compilation des assets, les fichiers `.sass` sont transformés en `.css` et placés dans le répertoire `public/build`.


## Structure du projet
Le projet est structuré de manière à séparer le back-end (Symfony et PHP) et le front-end (TypeScript et React), tout en assurant une intégration fluide à travers Webpack Encore pour gérer les assets (CSS, JavaScript).

## 2.Information installation local

## Prérequis

### Logiciels nécessaires
- **PHP** : ≥ 8.2
- **Composer** : Dernière version
- **Node.js** : ≥ 16
- **npm** : Dernière version
- **MongoDB** : Configuré sur votre machine
- **Base de données relationnelle** : MySQL/MariaDB
- **Serveur web** : Apache ou Nginx

### Extensions PHP requises
- `ext-ctype`
- `ext-iconv`
- `ext-mongodb`

---

## Installation

### Back-end Symfony

1. **Cloner le projet :**
   ```bash
  git clone https://github.com/Aerdalis01/Sf_Zoo_Arcadia.git
  cd Sf_Zoo_Arcadia/Sf_Zoo_Arcadia
2. **Installer les dépendances PHP:**
  ```bash
    composer install
3. **Configurer l'environnement**
  ```bash
    cp .env.example .env

Modifier les variables dans le fichier .env :
DATABASE_URL=mysql://<user>:<password>@127.0.0.1:3306/<database_name>
MONGODB_URL=mongodb://<user>:<password>@127.0.0.1:27017


4. **Commande initialisation**
    ```bash
      chmod +x rest_db_and_init.sh
      ./rest_db_and_init.sh

Cela créer la bdd, l'admin ainsi que les fixtures et lance le serveur mongodb
5. **Installer les dépendances front-end**
    ```bash
      npm install
6. **Compiler les assets**
Pour le développement :
    ```bash
      npm run dev
Pour la production :
    ```bash
      npm run build

7. **Démarrer les serveurs**
    ```bash
      symfony serve



### 3. Documentation déploiement

- **Nom du projet** : `Ecf_project`
- **Objectif** : Création d'un projet de zoo
- **Environnement cible** : Hostinger

- **Accès au serveur** :
  ```bash
  ssh -p 65002 u389160231@147.79.103.35
  Mot de passe d\'accès: mot de passe de l\'admin

  

  Dans public_html/ecf créer un fichier .htaccess
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ Sf_Zoo_Arcadia/Sf_Zoo_Arcadia/public/$1 [L]
  </IfModule>


# PHP dependencies

-**Installez les dépendances PHP avec Composer :**
    ```bash
    composer2 install

# Node.js et npm installation

-**Installez Node.js avec nvm**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    nvm install 18

-**Installez les dépendances avec npm**
    ```bash
      npm install

# Configurer le mailer DSN avec les informations du serveur:
  .env:
  MAILER_DSN=smtp://127.0.0.1:1025
  Modifier les informations en remplaçant le MAILER_DSN avec les informations de l'hébergeur
# Compilation du fichier en local (impossible sur le serveur):
  -**Compilez pour la production :**
    ```bash
      npm run build
# Déploiement au Serveur
  **Transférez le dossier compilé vers le serveur :** 
    scp -P 65002 -r ./public u389160231@147.79.103.35:/home/u389160231/domains/arcadiabroceliande.com/public_html/Ecf/Sf_Zoo_Arcadia/Sf_Zoo_Arcadia/public

    Le mot de passe à renseigner est celui de l'admin
  **Corrigez les permissions sur le serveur :** 
     ```bash
    chmod -R 775 var/
    chmod -R 775 public/

  **Vider le cache :** 
    ```bash
      php bin/console c:c
      php bin/console c:w