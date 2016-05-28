# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.12)
# Database: medications
# Generation Time: 2016-05-28 17:34:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table clients
# ------------------------------------------------------------

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;

INSERT INTO `clients` (`id`, `first`, `last`, `street`, `city`, `state`, `zip`, `phone_number`, `email`, `password_hash`, `createdAt`, `updatedAt`)
VALUES
	(1,'David','Rips','20 Stillhouse Rd.','Millstone','New Jersey','08535',NULL,'rips.david@gmail.com','$2a$10$1T9p4ja8jmxsny3tzDEDJe0E7kZ5D0BP8yPxZ0xmcGA7La2mHeFde','2016-05-28 17:24:32','2016-05-28 17:24:32');

/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table prescriptions
# ------------------------------------------------------------

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;

INSERT INTO `prescriptions` (`id`, `medname`, `dose`, `time_of_day`, `with_food`, `date_filled`, `amount_days`, `refills`, `prescribing_doctor`, `pharm_name`, `directions`, `notes`, `rxuid`, `createdAt`, `updatedAt`, `clientId`)
VALUES
	(2,'Tylenol','20mg','0',NULL,'2 May, 2016','30','3','Dr. Ouch','Rite Aid','Take when it hurts.','','202433','2016-05-28 17:27:51','2016-05-28 17:27:51',1),
	(4,'allegra','30','0',NULL,'13 May, 2016','23','3','Dr. Pollen','CVS','Take everyday because nature.','','324026','2016-05-28 17:29:42','2016-05-28 17:29:42',NULL),
	(5,'Aluminum Hydroxide','40mg','0',NULL,'11 May, 2016','34','4','Dr. Metal','Rite Aid','IDK tbh','','612','2016-05-28 17:30:15','2016-05-28 17:30:15',NULL),
	(6,'Acebutolol','40','0',NULL,'3 May, 2016','60','1','Dr. Lol','Local Pharmacy','Take whenever I guess','','149','2016-05-28 17:31:01','2016-05-28 17:31:01',NULL),
	(7,'Prozac','50','0',NULL,'10 May, 2016','30','1','Dr. Happy','Walmart','Take everyday b/c life  ','','58827','2016-05-28 17:32:02','2016-05-28 17:32:02',NULL),
	(9,'Prilosec','30','0',NULL,'11 May, 2016','30','2','Dr. Tums','CVS','Take with food','','203345','2016-05-28 17:33:19','2016-05-28 17:33:19',NULL);

/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
