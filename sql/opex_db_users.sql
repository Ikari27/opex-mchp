-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: opex_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `nickname` text,
  `badgeid` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `trainer_coach` enum('Trainer','Coach','Both','None') DEFAULT 'None',
  `lss_pdca` enum('LSS','PDCA','None') NOT NULL DEFAULT 'None',
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `certification` enum('Green Belt','Black Belt','None') DEFAULT 'None',
  `cert_candidate` enum('Certified','Candidate','None') DEFAULT 'None',
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `site` enum('MPHIL1','MPHIL3') DEFAULT 'MPHIL1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `badgeid` (`badgeid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mark Daniel','Tabor','Daniel','A80069','markdaniel.tabor@microchip.com','$2b$10$cyaUGo7hqyvqgUQXj3m4EeqYRVDH770ArzMc.elJ1.bJ0aMTc5Kqa','admin','None','None','Engineer I-Process','Test Ops Process Engg','None','None','/assets/uploads/user_1.png','2026-10-16 13:01:33','MPHIL1'),(3,'Admin','Account',NULL,'admin','admin@microchip.com','$2b$10$Yhfj.Vn5s0eaKGek8TmaYOuQChivwb8yAPpr.Zddm.xY.ueJi/.A6','admin','None','None','','','None','None','','2026-10-16 13:02:35','MPHIL1'),(4,'Maria Theresa','Ferrer','Thess','A52301','MariaTheresa.ValerioFerrer@microchip.com','$2b$10$xP35oQR6sEplOvtV8pzmEOv9lkjyxzdGMsv6U08ZoDP.e5mysyFLm','admin','Trainer','PDCA','Pr. Engineer-GL-Process Engineering','Process Engineering - Scan','Black Belt','Certified','./assets/uploads/user_4.png','2026-10-19 01:37:26','MPHIL1'),(5,'Carlo Emmanuel','Almazora','Carlo','A53411','CarloEmmanuel.Almazora@microchip.com','$2b$10$rNz.rZzFYbDojmbtRO2u9OZIJgj7WaZiuhau/jCpLdbDbzX0AgO5y','user','None','None','Engineer II-Process Sustaining','Test Ops Process Engg','Green Belt','Certified','/assets/uploads/user_5.png','2026-10-20 06:40:23','MPHIL1'),(6,'Jerome','Bando','','A53389','Jerome.Bando@microchip.com','$2b$10$3cwUP0OwPL8zLdBzRijPFOy.H2EjacyUrVW/krPUvuO67soNCI/mu','user','None','None','Engineer II-Process Sustaining','Test Ops Process Engg','Green Belt','Certified','./assets/uploads/user_6.png','2026-10-20 06:59:14','MPHIL1'),(7,'Donald','Cruz','Donald','A67331','Donald.Cruz@microchip.com','$2b$10$sMQF5aeeOCDIQqURaSMx1epf6Olz2On9Kso8BMRkrh7G2FWJMOqjy','admin','Coach','LSS','Manager-Process Engineering','Test Ops Process Engg','None','None','./assets/uploads/user_7.png','2026-10-21 03:36:13','MPHIL1'),(8,'Judy','Hugo','','A42521','Judy.Hugo@microchip.com','$2b$10$H.mC32OoPRZRhZzJbGkNpufosSzYNoGGPKvxIvG0rDrQs96FgWjmW','user','Trainer','PDCA','Manager II-Production','Test Ops Analog','None','None','./assets/uploads/user_8.png','2026-10-21 06:07:00','MPHIL1'),(9,'Flor','Abayan','','A42137','Flora.Abayan@microchip.com','$2b$10$m21n9bdnfq4VjUmLojbaven2KPp2nTpFqcwHqiXYCiOFVe0.3gaPe','user','Both','LSS','Manager-Yield Enhancement','MFG Support & Systems Engg','None','None','./assets/uploads/user_9.png','2026-10-21 06:09:03','MPHIL1'),(10,'Liza','Jalos','','A42531','Liza.Jalos@microchip.com','$2b$10$jsiR/UprWzPvgH.c7.Brz.1Ygpb6B4CvfPwb81gGx/9McyFsw6R7m','admin','Trainer','PDCA','Sr. Manager-Production','Test Ops Scan','None','None','./assets/uploads/user_10.jpg','2026-10-21 06:50:16','MPHIL1'),(11,'Julius','Robles','Julio','A18941','Julius.Robles@microchip.com','$2b$10$HFhLNmzJa9x7hV.4Ixp/8OnZva2zkemCGI0TF7wQgkDa8UAHdHIg2','user','None','None','Principal Engineer-Equipment','Test Ops Equip&Maint Singulate','Black Belt','Certified','./assets/uploads/user_11.png','2026-10-23 01:31:55','MPHIL1'),(12,'Myla','Baided','','A42221','Myla.Baided@microchip.com','$2b$10$q3R9UFOCGORE5wmgCXbgxu/hyPPoisbt8NnkKT0E6h2HltTyQ88IS','user','None','None','Senior Engineer II-Proces','Wafer Probe Process Engg','Black Belt','Certified','/assets/uploads/user_12.png','2026-10-23 02:06:58','MPHIL1'),(13,'Fernando','Manalili','','A42613','Fernando.Manalili@microchip.com','$2b$10$jfe/tuizr7lpjFGuUxpJ6uTkM88UQRh6coJbznncObbDqLFN1o9oG','user','Trainer','PDCA','Principal Engineer-Process','Test Ops Scan','None','None','/assets/uploads/user_13.jpg','2026-10-23 02:12:32','MPHIL1'),(14,'Lyn','Garcia','','A42482','Rodelyn.Garcia@microchip.com','$2b$10$HdjS6V3yNYlToCNZEXhL0uHLrEpVOAKNStkBGrkqjoCIwKiPKbSa2','user','Trainer','PDCA','Technical Staff Engineer-Industrial','Corporate Planning','None','None','/assets/uploads/user_14.jpg','2026-10-23 02:17:10','MPHIL1'),(15,'Alma','Fontanilla','','A42467','Alma.Fontanilla@microchip.com','$2b$10$THLdUpvdFwHOvLDxteNS2eQbirvaaSuFffBzUoVzZZOq5QSh3jZ0C','user','Trainer','PDCA','Manager - Production','Wafer Probe Equip&Maint HW','None','None','/assets/uploads/user_15.jpg','2026-10-23 02:18:49','MPHIL1'),(16,'Dennis','Desacola','','A42408','Dennis.Desacola@microchip.com','$2b$10$ke0OPE.XrUrjvj22gyGpLeCXZb9cdCLDakWYNKStB7SPmmU.1w4Gu','user','Coach','LSS','Manager-Manufacturing Equipment Engineering','Test Ops Equip&Maint','Black Belt','Certified','/assets/uploads/user_16.png','2026-10-23 02:24:20','MPHIL1'),(17,'Glenmore','Gabuay','','A68665','Glenmore.Gabuay@microchip.com','$2b$10$ObChSfwcdRU4LTlunX1qYeBd5GZaHIJSSgNGt6B1xHLjsKo.aBwry','user','None','None','Senior Engineer II-Process Sustaining','Test Ops Process Eng','Green Belt','Candidate','./assets/uploads/user_17.jpg','2026-10-23 02:30:36','MPHIL1'),(18,'Rely','Remo','','A42797','Rely.Remo@microchip.com','$2b$10$5roqAp9u2r6PlQ4.p6SNRuOgEQ7nJBhT6nZk6oirsi1xvF0tgxDVe','user','None','None','Principal Engineer-Product','WSG Product and Test Engg','Black Belt','Certified',NULL,'2026-10-23 03:24:20','MPHIL1'),(19,'Mark','Insauriga','','A42524','Mark.Insauriga@microchip.com','$2b$10$qu3oHN9P4bSVGKnVO8GeBOSZlQeOvX4SXZ6.HjIpWYskONu32TgP6','user','None','None','Senior Engineer II-Process Sustaining','Test Ops Process Engg','Black Belt','Certified','./assets/uploads/user_19.jpg','2026-10-23 03:25:48','MPHIL1'),(20,'Limuel','Manaig','','A42612','Limuel.Manaig@microchip.com','$2b$10$/3kueW/E7bFmVq91fFZot.3NaUTucIPBk3orXwz/z7aEcxvRZckla','user','None','None','Pr. Engineer-GL-Product','Backend BU Ops MCU','Green Belt','Certified',NULL,'2026-10-23 03:32:00','MPHIL1'),(21,' Janice Ruth','Bayogan','','A63870','JaniceRuth.Bayogan@microchip.com','$2b$10$MuUGH42ObKYSPC8AHgBhMeboFIcnHM6mJpXdpVmqWdtJ3/prN7fv6','user','None','None','Senior Engineer I-Product','WSG Product and Test Engg','Green Belt','Certified',NULL,'2026-10-23 03:33:04','MPHIL1'),(22,'Jhen','Cruz','','A42349','Jhen.Cruz@microchip.com','$2b$10$ft2IbJpriNCBQ.KpbwgL4e6/tBkD0T9DkIfHSgvkDznjQZUaeu/oa','user','None','None','Engineer II-Yield Enhancement','MFG Support & Systems Engg','Green Belt','Certified',NULL,'2026-10-23 03:34:04','MPHIL1'),(23,'Edward Henry','Dela Cruz','','A50255','EdwardHenry.DelaCruz@microchip.com','$2b$10$11s1nIWksgbWpbHtbcb1.u7suUk/7FX0wwxt6PX4S8W0HwWixHPTq','user','None','None','Senior Engineer II-Hardware Assembly','Test Systems Group','Green Belt','Certified',NULL,'2026-10-23 03:35:35','MPHIL1'),(24,'Normita','Quiminales','Normie','A42776','Normita.Quiminales@microchip.com','$2b$10$Tcva.n.rVpUo6UoAomW6/eZbTuWPsy9rAFZbAUA/vTFAQhWl5EQL2','user','None','None','Senior Engineer II-Process','Wafer Probe Process Engg','Green Belt','Certified',NULL,'2026-10-23 03:36:35','MPHIL1'),(25,'Rinor','Baluyot','','A19499','Rinor.Baluyot@microchip.com','$2b$10$M6rIqpBCNtcLk9bfiz2Z8.WKapn1vkSoylT/HtkL8H.VXeMiR5ME2','user','None','None','Principal Engineer-Mechanical Design','Test Systems Group','Green Belt','Certified',NULL,'2026-10-23 03:37:37','MPHIL1');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-23 14:49:54
