-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: opex_db
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
-- Table structure for table `web_content`
--

DROP TABLE IF EXISTS `web_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_content` (
  `id` int NOT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_content`
--

LOCK TABLES `web_content` WRITE;
/*!40000 ALTER TABLE `web_content` DISABLE KEYS */;
INSERT INTO `web_content` VALUES (1,'Operational Excellence'),(2,'Lead and integrate company-wide continuous improvement efforts by championing a data-driven culture of operational excellence and leveraging Lean Six Sigma Black Belts, Green Belts, Kaizen teams, digital transformation initiatives, and other strategic improvement programs to systematically eliminate waste, reduce process variation, optimize productivity, improve quality, lower costs, and deliver sustainable business value.'),(3,'SAVED'),(4,'Cost Improvements Initiatives'),(5,'TRAINED'),(6,'GB &amp; BB Certified'),(7,'PROJECTS'),(8,'Accomplished'),(9,'F4.0: A Journey to Operational Excellence'),(10,'A journey that involves applying the right tools to the right processes.'),(11,'An Operational Excellence through:'),(12,'✓ Teamwork'),(13,'✓ Empowered Employees'),(14,'✓ Engaged Employees'),(15,'Operational Excellence'),(16,'Success is not achieved by one giant leap, but by many small, deliberate steps that eventually help reach the summit.'),(17,'Operational Excellence Team'),(18,'Will drive all Continuous Improvement initiatives through Lean Six Sigma (Black Belt and Green Belt) programs, Kaizen teams, digital transformation initiatives, productivity improvements, cost reduction programs, and other strategic operational excellence efforts.'),(19,'Operational Excellence Program Framework'),(20,'Lead and integrate company-wide continuous improvement efforts by championing a data-driven culture of operational excellence and leveraging Lean Six Sigma Black Belts, Green Belts, Kaizen teams, digital transformation initiatives, and other strategic improvement programs to systematically eliminate waste, reduce process variation, optimize productivity, improve quality, lower costs, and deliver sustainable business value.'),(21,'./assets/uploads/1792220600410-M\' Meldz 2 (2).png'),(22,'./assets/uploads/1792220862107-sample1.jpg'),(23,'./assets/uploads/1792220865666-sample2.jpg'),(24,'./assets/uploads/1792220871874-sample3.jpg'),(25,'./assets/uploads/1792222272353-FACTORY 4.0 Race 4 LYF.mp4');
/*!40000 ALTER TABLE `web_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 20:29:58
