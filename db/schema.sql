CREATE DATABASE medications;
USE medications;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first` varchar(255) DEFAULT NULL,
  `last` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `medname` varchar(255) DEFAULT NULL,
  `dose` varchar(255) DEFAULT NULL,
  `time_of_day` varchar(255) DEFAULT NULL,
  `with_food` varchar(255) DEFAULT NULL,
  `date_filled` varchar(255) DEFAULT NULL,
  `amount_days` varchar(255) DEFAULT NULL,
  `refills` varchar(255) DEFAULT NULL,
  `prescribing_doctor` varchar(255) DEFAULT NULL,
  `pharm_name` varchar(255) DEFAULT NULL,
  `directions` text,
  `notes` text,
  `rxuid` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `clientId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rxnconsos` (
  `RXCUI` varchar(8) NOT NULL,
  `STR` varchar(3000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;