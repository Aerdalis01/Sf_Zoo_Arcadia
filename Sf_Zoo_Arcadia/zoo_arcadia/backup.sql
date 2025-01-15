-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: sf_zooarcadia
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alimentation`
--

DROP TABLE IF EXISTS `alimentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alimentation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `nourriture` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_used` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8E65DFA08E962C16` (`animal_id`),
  CONSTRAINT `FK_8E65DFA08E962C16` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alimentation`
--

LOCK TABLES `alimentation` WRITE;
/*!40000 ALTER TABLE `alimentation` DISABLE KEYS */;
INSERT INTO `alimentation` VALUES (1,1,'2024-11-17','16:04:25','Herbe','5 kg','employe1@gmail.com',1),(2,2,'2024-11-17','16:04:25','Fruits','200 g','employe2@gmail.com',1),(3,3,'2024-11-17','16:04:25','Grains','1 kg','employe3@gmail.com',1),(4,4,'2024-11-17','16:04:25','Vers','300 g','employe1@gmail.com',0),(5,5,'2024-11-17','16:04:25','Écorce','1.5 kg','employe2@gmail.com',1),(6,6,'2024-11-17','16:04:25','Fruits et feuilles','2 kg','employe3@gmail.com',1),(7,7,'2024-11-17','16:04:25','Feuilles','10 kg','employe1@gmail.com',1),(8,8,'2024-11-17','16:04:25','Algues','500 g','employe2@gmail.com',1),(9,9,'2024-11-17','16:04:25','Fourmis','700 g','employe3@gmail.com',1),(10,10,'2024-11-17','16:04:25','Herbes','4 kg','employe1@gmail.com',1),(11,11,'2024-11-17','16:04:25','Poissons','300 g','employe2@gmail.com',0),(12,12,'2024-11-17','16:04:25','Herbes','3 kg','employe3@gmail.com',1),(13,13,'2024-11-17','16:04:25','Fruits et insectes','150 g','employe1@gmail.com',0),(14,14,'2024-11-17','16:04:25','Carottes','100 g','employe2@gmail.com',1),(15,15,'2024-11-17','16:04:25','Poissons','400 g','employe3@gmail.com',1),(16,16,'2024-11-17','16:04:25','Feuilles','250 g','employe1@gmail.com',1),(17,17,'2024-11-17','16:04:25','Herbes','8 kg','employe2@gmail.com',1),(18,18,'2024-11-17','16:04:25','Feuilles d’acacia','6 kg','employe3@gmail.com',1),(19,19,'2024-11-17','16:04:25','Insectes','200 g','employe1@gmail.com',0),(20,20,'2024-11-17','16:04:25','Fruits','150 g','employe2@gmail.com',1),(21,21,'2024-11-17','16:04:25','Herbes','5 kg','employe3@gmail.com',1);
/*!40000 ALTER TABLE `alimentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `habitat_id` int DEFAULT NULL,
  `race_id` int DEFAULT NULL,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_6AAB231FAFFE2D26` (`habitat_id`),
  KEY `IDX_6AAB231F6E59D40D` (`race_id`),
  CONSTRAINT `FK_6AAB231F6E59D40D` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`),
  CONSTRAINT `FK_6AAB231FAFFE2D26` FOREIGN KEY (`habitat_id`) REFERENCES `habitat` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (1,1,1,'René le Cerf','2024-11-17 16:04:25',NULL),(2,3,2,'Sarah le Ara','2024-11-17 16:04:25',NULL),(3,2,3,'babeth l\'Autruche','2024-11-17 16:04:25',NULL),(4,1,4,'Alex le Canard branchu','2024-11-17 16:04:25',NULL),(5,1,5,'Algor le Castor','2024-11-17 16:04:25',NULL),(6,3,6,'Léo le Chimpanzé','2024-11-17 16:04:25',NULL),(7,2,7,'Basile l\'Éléphant','2024-11-17 16:04:25',NULL),(8,1,8,'jack le Flamant Rose','2024-11-17 16:04:25',NULL),(9,3,9,'Jérémie le Fourmilier','2024-11-17 16:04:25',NULL),(10,2,10,'Joe le Gnou','2024-11-17 16:04:25',NULL),(11,1,11,'Olaf le Héron','2024-11-17 16:04:25',NULL),(12,2,12,'Leila l\'Impala','2024-11-17 16:04:25',NULL),(13,3,13,'Jango le Ouistiti','2024-11-17 16:04:25',NULL),(14,1,14,'Flocon le Lapin des marais','2024-11-17 16:04:25',NULL),(15,1,15,'Lisa la Loutre','2024-11-17 16:04:25',NULL),(16,3,16,'Gaston le Paresseux','2024-11-17 16:04:25',NULL),(17,2,17,'Rhinocéros','2024-11-17 16:04:25',NULL),(18,2,18,'Sofie la Girafe','2024-11-17 16:04:25',NULL),(19,3,19,'Benoit le Tatou','2024-11-17 16:04:25',NULL),(20,3,20,'Alban le Toucan','2024-11-17 16:04:25',NULL),(21,2,21,'Eliott le Zèbre','2024-11-17 16:04:25',NULL);
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_report`
--

DROP TABLE IF EXISTS `animal_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alimentation_id` int DEFAULT NULL,
  `etat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etat_detail` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `animal_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_7EDEB2588441D4D9` (`alimentation_id`),
  KEY `IDX_7EDEB2588E962C16` (`animal_id`),
  CONSTRAINT `FK_7EDEB2588441D4D9` FOREIGN KEY (`alimentation_id`) REFERENCES `alimentation` (`id`),
  CONSTRAINT `FK_7EDEB2588E962C16` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_report`
--

LOCK TABLES `animal_report` WRITE;
/*!40000 ALTER TABLE `animal_report` DISABLE KEYS */;
INSERT INTO `animal_report` VALUES (1,1,'En bonne santé','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le cerf montre un bon comportement général.',1),(2,2,'Actif','2024-11-17 16:04:26',NULL,'vet2@gmail.com','L’ara est actif et vocalise régulièrement.',2),(3,3,'Nerveuse','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','L’autruche montre des signes de nervosité.',3),(4,4,'Calme','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le canard est calme et se nourrit bien.',4),(5,5,'En forme','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le castor est en bonne santé et actif.',5),(6,6,'Joueur','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le chimpanzé est joueur et social avec les visiteurs.',6),(7,7,'Sain','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','L’éléphant est en bonne condition physique et actif.',7),(8,8,'Vigoureux','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le flamant rose montre une activité vigoureuse.',8),(9,9,'En bonne santé','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le fourmilier est en bonne santé et actif.',9),(10,10,'Actif','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le gnou est en forme et se déplace souvent dans son enclos.',10),(11,11,'Paisible','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le héron est calme et ne montre aucun signe de stress.',11),(12,12,'En forme','2024-11-17 16:04:26',NULL,'vet2@gmail.com','L’impala est active et montre un bon comportement.',12),(13,13,'Curieux','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le ouistiti est très curieux de son environnement.',13),(14,14,'Calme','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le lapin montre un comportement calme et stable.',14),(15,15,'Joueuse','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','La loutre est en bonne santé et joue dans l’eau.',15),(16,16,'Lent mais sain','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le paresseux est lent comme d’habitude mais en bonne santé.',16),(17,17,'Fort','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le rhinocéros est en bonne santé et très fort.',17),(18,18,'Alert','2024-11-17 16:04:26',NULL,'vet2@gmail.com','La girafe est vigilante et montre des signes de bonne santé.',18),(19,19,'En bonne santé','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le tatou est en bonne santé et est actif la nuit.',19),(20,20,'Vocal','2024-11-17 16:04:26',NULL,'vet2@gmail.com','Le toucan est très vocal et en bonne santé.',20),(21,21,'Actif','2024-11-17 16:04:26',NULL,'capucinepouchard@gmail.com','Le zèbre est en bonne forme physique.',21);
/*!40000 ALTER TABLE `animal_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avis` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` int NOT NULL,
  `valid` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
INSERT INTO `avis` VALUES (1,'Alice Dupont','Super expérience, les animaux sont bien soignés.',5,1,'2024-11-17 16:04:25'),(2,'Paul Martin','Belle journée en famille, mais un peu cher.',4,1,'2024-11-17 16:04:25'),(3,'Claire Bonnet','Beaucoup d’attente à l’entrée.',3,0,'2024-11-17 16:04:25'),(4,'Jean Durant','Pas assez de places de parking.',2,1,'2024-11-17 16:04:25'),(5,'Marie Lefevre','Les enfants ont adoré, à refaire !',5,1,'2024-11-17 16:04:25'),(6,'Marc Petit','Le personnel est accueillant et serviable.',4,0,'2024-11-17 16:04:25'),(7,'Lucie Caron','Les animaux sont très bien traités.',5,1,'2024-11-17 16:04:25'),(8,'David Garnier','Les animations sont bien organisées.',4,1,'2024-11-17 16:04:25'),(9,'Sophie Brun','Un peu déçu par la restauration.',3,0,'2024-11-17 16:04:25'),(10,'Emma Leroy','Le parc est très propre et bien entretenu.',5,1,'2024-11-17 16:04:25');
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_responded` tinyint(1) NOT NULL,
  `send_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `response_message` longtext COLLATE utf8mb4_unicode_ci,
  `responded_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,'alice@example.com','Demande d\'information','Je souhaiterais obtenir plus de détails sur les tarifs.',1,'2024-11-17 16:04:25','Bonjour, merci pour votre intérêt. Voici les informations...','2024-11-15 16:04:25'),(2,'bob@example.com','Problème technique','J\'ai des difficultés à utiliser le site.',0,'2024-11-17 16:04:25',NULL,NULL),(3,'charlie@example.com','Réservation annulée','J\'ai besoin d\'aide pour annuler une réservation.',1,'2024-11-17 16:04:25','Votre réservation a été annulée avec succès.','2024-11-16 16:04:25'),(4,'david@example.com','Demande de partenariat','Je souhaite proposer un partenariat.',0,'2024-11-17 16:04:25',NULL,NULL),(5,'eve@example.com','Merci pour votre accueil','Nous avons passé un moment formidable, merci !',1,'2024-11-17 16:04:25','Merci beaucoup pour vos retours positifs !','2024-11-14 16:04:25');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20241106194501','2024-11-17 16:04:22',1148),('DoctrineMigrations\\Version20241108200555','2024-11-17 16:04:23',9),('DoctrineMigrations\\Version20241114112436','2024-11-17 16:04:23',11),('DoctrineMigrations\\Version20241114150751','2024-11-17 16:04:23',61),('DoctrineMigrations\\Version20241116143246','2024-11-17 16:04:23',123);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitat`
--

DROP TABLE IF EXISTS `habitat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_id` int DEFAULT NULL,
  `nom` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_3B37B2E83DA5256D` (`image_id`),
  CONSTRAINT `FK_3B37B2E83DA5256D` FOREIGN KEY (`image_id`) REFERENCES `image` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitat`
--

LOCK TABLES `habitat` WRITE;
/*!40000 ALTER TABLE `habitat` DISABLE KEYS */;
INSERT INTO `habitat` VALUES (1,9,'Marais','Un environnent humide avec son lac et son bois. Venez\r\n        découvrir des animaux emblématique de la région tel le cerf blanc et le héron cendré ainsi que le canard\r\n        branchu, le castor, les loutres, les tortues et lapin des marais.','2024-11-17 16:04:25',NULL),(2,10,'Savane','Dans cette vaste plaine de 2 hectares, venez à la rencontre\r\n        des animaux les plus emblématiques d’Afrique. Eléphant, girafes, gnous, rhinocéros blancs, zèbres , autruches,\r\n        impala et tous leurs petits évoluent harmonieusement dans ce territoire incroyable, pour votre\r\n        plaisir !','2024-11-17 16:04:25',NULL),(3,8,'Jungle','Dans un écosytème riche où la vie foisoinne, retrouvez le\r\n        ouistiti, le fourmilier, le chimpanzé, le tatoo, le paresseux, le toucan, et le ara.','2024-11-17 16:04:25',NULL);
/*!40000 ALTER TABLE `habitat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitat_comment`
--

DROP TABLE IF EXISTS `habitat_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitat_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `habitat_id` int DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_C86D6DCEAFFE2D26` (`habitat_id`),
  CONSTRAINT `FK_C86D6DCEAFFE2D26` FOREIGN KEY (`habitat_id`) REFERENCES `habitat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitat_comment`
--

LOCK TABLES `habitat_comment` WRITE;
/*!40000 ALTER TABLE `habitat_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `habitat_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire`
--

DROP TABLE IF EXISTS `horaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  `horaire_texte` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire`
--

LOCK TABLES `horaire` WRITE;
/*!40000 ALTER TABLE `horaire` DISABLE KEYS */;
INSERT INTO `horaire` VALUES (1,'2024-11-17 16:04:25','2024-11-18 12:13:42','Lundi: 09h00 - 17h00            Mardi: 09h00 - 18h00            Mercredi: 09h00 - 18h00            Jeudi: 09h00 - 18h00            Vendredi: 09h00 - 18h00            Samedi: 09h00 - 18h00            Dimanche: Fermé');
/*!40000 ALTER TABLE `horaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `animal_id` int DEFAULT NULL,
  `sous_service_id` int DEFAULT NULL,
  `habitat_id` int DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_sub_directory` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_C53D045FED5CA9E6` (`service_id`),
  UNIQUE KEY `UNIQ_C53D045F8E962C16` (`animal_id`),
  UNIQUE KEY `UNIQ_C53D045FAFFE2D26` (`habitat_id`),
  KEY `IDX_C53D045FB24FC0C` (`sous_service_id`),
  CONSTRAINT `FK_C53D045F8E962C16` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id`),
  CONSTRAINT `FK_C53D045FAFFE2D26` FOREIGN KEY (`habitat_id`) REFERENCES `habitat` (`id`),
  CONSTRAINT `FK_C53D045FB24FC0C` FOREIGN KEY (`sous_service_id`) REFERENCES `sous_service` (`id`),
  CONSTRAINT `FK_C53D045FED5CA9E6` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (1,NULL,NULL,1,NULL,'Image Snack','/uploads/images/services/Snack.webp','services','2024-11-17 16:04:24',NULL),(2,NULL,NULL,2,NULL,'Resto','/uploads/images/services/Resto.webp','services','2024-11-17 16:04:24',NULL),(3,NULL,NULL,2,NULL,'menu-67063393cdcd7.svg','/uploads/images/services/menu-67063393cdcd7.svg','services','2024-11-17 16:04:24',NULL),(4,NULL,NULL,3,NULL,'CamionGlace','/uploads/images/services/CamionGlace.webp','services','2024-11-17 16:04:24',NULL),(5,2,NULL,NULL,NULL,'VisiteGuidee','/uploads/images/services/VisiteGuidee.webp','services','2024-11-17 16:04:24',NULL),(6,3,NULL,NULL,NULL,'PetitTrain','/uploads/images/services/PetitTrain.webp','services','2024-11-17 16:04:24',NULL),(7,4,NULL,NULL,NULL,'carte-du-zoo','/uploads/images/services/Carte-du-zoo-6705429dd14eb.svg','services','2024-11-17 16:04:24',NULL),(8,NULL,NULL,NULL,NULL,'Jungle','/uploads/images/carousel/bg-jungle-carousel.webp','habitats','2024-11-17 16:04:25',NULL),(9,NULL,NULL,NULL,NULL,'Marais','/uploads/images/carousel/bg-marais-carousel.webp','habitats','2024-11-17 16:04:25',NULL),(10,NULL,NULL,NULL,NULL,'Savane','/uploads/images/carousel/Savane-lg.webp','habitats','2024-11-17 16:04:25',NULL),(11,NULL,1,NULL,NULL,'aerdalis01-photrealistic-a-white-cerf-selfie-386cd011-80ef-44a9-8ca4-4be08c9ca9ba-fotor-2024052112256-20241105132716-672a1d34014a9','/uploads/images/animals/aerdalis01-photrealistic-a-white-cerf-selfie-386cd011-80ef-44a9-8ca4-4be08c9ca9ba-fotor-2024052112256-20241105132716-672a1d34014a9.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(12,NULL,2,NULL,NULL,'Ara-66a100622141f','/uploads/images/animals/Ara-66a100622141f.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(13,NULL,3,NULL,NULL,'autruche-66a10654b954f','/uploads/images/animals/autruche-66a10654b954f.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(14,NULL,4,NULL,NULL,'canard-66a1051de3c71','/uploads/images/animals/canard-66a1051de3c71.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(15,NULL,5,NULL,NULL,'castor-66a1052a5313a','/uploads/images/animals/castor-66a1052a5313a.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(16,NULL,6,NULL,NULL,'Chimpanze-66a10074e647f','/uploads/images/animals/Chimpanze-66a10074e647f.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(17,NULL,7,NULL,NULL,'elephant-66a1066c99a48','/uploads/images/animals/elephant-66a1066c99a48.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(18,NULL,8,NULL,NULL,'Flamant-20241105132725-672a1d3d6503a','/uploads/images/animals/Flamant-20241105132725-672a1d3d6503a.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(19,NULL,9,NULL,NULL,'Fourmilier-66a100819b3f9','/uploads/images/animals/Fourmilier-66a100819b3f9.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(20,NULL,10,NULL,NULL,'Gnou','/uploads/images/animals/Gnou.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(21,NULL,11,NULL,NULL,'heron-66a1056804ca0','/uploads/images/animals/heron-66a1056804ca0.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(22,NULL,12,NULL,NULL,'impala-66a1069864089','/uploads/images/animals/impala-66a1069864089.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(23,NULL,13,NULL,NULL,'Jango le ouistiti','/uploads/images/animals/Jango le ouistiti.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(24,NULL,14,NULL,NULL,'lapin-66a105e1033d9','/uploads/images/animals/lapin-66a105e1033d9.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(25,NULL,15,NULL,NULL,'loutre-66a105f491ec3','/uploads/images/animals/loutre-66a105f491ec3.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(26,NULL,16,NULL,NULL,'Paresseux-66a101edecc33','/uploads/images/animals/Paresseux-66a101edecc33.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(27,NULL,17,NULL,NULL,'rhino-66a106cd3601f','/uploads/images/animals/rhino-66a106cd3601f.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(28,NULL,18,NULL,NULL,'Sofie la girafe','/uploads/images/animals/Sofie la girafe.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(29,NULL,19,NULL,NULL,'Tatoo-66a101ff327b6','/uploads/images/animals/Tatoo-66a101ff327b6.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(30,NULL,20,NULL,NULL,'Toucan-66a1020e370a5','/uploads/images/animals/Toucan-66a1020e370a5.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25'),(31,NULL,21,NULL,NULL,'zebre-66a106e0e93f2','/uploads/images/animals/zebre-66a106e0e93f2.webp','animals','2024-11-17 16:04:25','2024-11-17 16:04:25');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race`
--

DROP TABLE IF EXISTS `race`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race`
--

LOCK TABLES `race` WRITE;
/*!40000 ALTER TABLE `race` DISABLE KEYS */;
INSERT INTO `race` VALUES (1,'Cerf','2024-11-17 16:04:25',NULL),(2,'Perroquet','2024-11-17 16:04:25',NULL),(3,'Autruche','2024-11-17 16:04:25',NULL),(4,'Canard','2024-11-17 16:04:25',NULL),(5,'Castor','2024-11-17 16:04:25',NULL),(6,'Singe','2024-11-17 16:04:25',NULL),(7,'Éléphant','2024-11-17 16:04:25',NULL),(8,'Flamant','2024-11-17 16:04:25',NULL),(9,'Fourmilier','2024-11-17 16:04:25',NULL),(10,'Antilope','2024-11-17 16:04:25',NULL),(11,'Oiseau','2024-11-17 16:04:25',NULL),(12,'Antilope','2024-11-17 16:04:25',NULL),(13,'Ouistiti','2024-11-17 16:04:25',NULL),(14,'Lapin','2024-11-17 16:04:25',NULL),(15,'Loutre','2024-11-17 16:04:25',NULL),(16,'Paresseux','2024-11-17 16:04:25',NULL),(17,'Rhinocéros','2024-11-17 16:04:25',NULL),(18,'Girafe','2024-11-17 16:04:25',NULL),(19,'Tatou','2024-11-17 16:04:25',NULL),(20,'Toucan','2024-11-17 16:04:25',NULL),(21,'Zèbre','2024-11-17 16:04:25',NULL);
/*!40000 ALTER TABLE `race` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `horaire_texte` longtext COLLATE utf8mb4_unicode_ci,
  `carte_zoo` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'Restauration','Une envie de grignoter ou une petite faim?',NULL,NULL,0,'2024-11-17 16:04:24',NULL),(2,'Visite guidée','Suivez le guide !!','Participez au visite guidée pour en apprendre plus sur les animaux et notre zoo.',NULL,0,'2024-11-17 16:04:24',NULL),(3,'Petit train','En voiture !!','Activités ludiques pour toute la famille.',NULL,0,'2024-11-17 16:04:24',NULL),(4,'Info Service','null','null','Départ des visites guidée: \n            09h00 \n            11h00 \n            13h00 \n            15h00\n            Départ des petits trains \n            10h00 \n            12h00 \n            14h00 \n            16h00',1,'2024-11-17 16:04:24',NULL);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sous_service`
--

DROP TABLE IF EXISTS `sous_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sous_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `nom` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `menu` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_C294E29FED5CA9E6` (`service_id`),
  CONSTRAINT `FK_C294E29FED5CA9E6` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sous_service`
--

LOCK TABLES `sous_service` WRITE;
/*!40000 ALTER TABLE `sous_service` DISABLE KEYS */;
INSERT INTO `sous_service` VALUES (1,1,'Snack','Un espace pour des snacks rapides et des boissons.',0,'2024-11-17 16:04:24',NULL),(2,1,'Restaurant','Venez déguster la cuisine de notre chef !',1,'2024-11-17 16:04:24',NULL),(3,1,'Camion glacé','Une envie de douceur?',0,'2024-11-17 16:04:24',NULL);
/*!40000 ALTER TABLE `sous_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'capucinepouchard@gmail.com','$2y$13$KIUil03OcuAuAWDcb9RAp.EQVz18ZBsGbHhsn4hM6xPUzVrabuB8e','[\"ROLE_VETERINAIRE\"]','2024-11-17 16:04:24','2024-11-17 16:04:24'),(2,'vet2@gmail.com','$2y$13$yVIC5CEJ51.Nmx6vTyZnNOv.ZpwtMn6LS4QEZiq6GUEf9.FvqxKtG','[\"ROLE_VETERINAIRE\"]','2024-11-17 16:04:24','2024-11-17 16:04:24'),(3,'employe1@gmail.com','$2y$13$3KXuNP9q.e4IXG1zkSO43.ty.9Bu5ixatu7QFdAG6SE1biJmIl1HK','[\"ROLE_EMPLOYE\"]','2024-11-17 16:04:25','2024-11-17 16:04:25'),(4,'employe2@gmail.com','$2y$13$hj2M5NV.vqHj0n4r3uOoa.k9DIaB.GldaFGz8sTxW9fh5/WdWiBGS','[\"ROLE_EMPLOYE\"]','2024-11-17 16:04:25','2024-11-17 16:04:25'),(5,'employe3@gmail.com','$2y$13$2nqnxUjvbdZCh63P1030l.Njxwz01YotjByCMrXj1WAWXBtui1eD2','[\"ROLE_EMPLOYE\"]','2024-11-17 16:04:25','2024-11-17 16:04:25'),(6,'josearcadia98@gmail.com','$2y$13$xNhBJFNm2uubAjVt3rn9COA2u0EC3NtkDG9zfXAQYHALUJW8rS4XS','[\"ROLE_ADMIN\"]','2024-11-17 16:04:27','2024-11-17 16:04:27'),(7,'test@mail.com','$2y$13$1LZL45EK1fR5LBoUr8WiTecXDMUe7n7/P25P6P1zKEL8DJie/16Ei','[\"ROLE_EMPLOYE\"]','2024-11-18 12:30:46','2024-11-18 12:30:46');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-18 14:53:23
