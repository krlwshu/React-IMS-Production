-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.21-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ims_proto
CREATE DATABASE IF NOT EXISTS `ims_proto` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `ims_proto`;

-- Dumping structure for table ims_proto.company_info
CREATE TABLE IF NOT EXISTS `company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(50) NOT NULL DEFAULT '',
  `website` varchar(100) DEFAULT NULL,
  `active` tinyint(4) DEFAULT 1,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.company_info: ~3 rows (approximately)
/*!40000 ALTER TABLE `company_info` DISABLE KEYS */;
INSERT INTO `company_info` (`id`, `name`, `address`, `website`, `active`, `date_created`) VALUES
	(1, 'Network Parts Ltd.', '1 London Road, London, NW1', NULL, 1, '2022-03-07 14:30:46'),
	(2, 'GTX Telco Ltd', '36 Spitfire Close, Huntingdon, Cambs, PE1 3DC', NULL, 1, '2022-03-07 14:30:46'),
	(3, 'Better Networks Ltd.', '43 Vastern Road, Reading, RG1 8DJ', NULL, 1, '2022-03-07 14:30:46'),
	(4, 'H2O Networks', '1 Vastern Road, Reading, RG18DJ', NULL, 1, '2022-03-07 14:30:46');
/*!40000 ALTER TABLE `company_info` ENABLE KEYS */;

-- Dumping structure for table ims_proto.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL DEFAULT 'New',
  `id_supplier` int(11) DEFAULT NULL,
  `ordered_by` varchar(50) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_orders_suppliers` (`id_supplier`),
  CONSTRAINT `FK_orders_suppliers` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1206 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.orders: ~7 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `status`, `id_supplier`, `ordered_by`, `date_created`) VALUES
	(1197, 'New', NULL, NULL, '2022-03-23 22:29:40'),
	(1198, 'New', NULL, NULL, '2022-03-23 22:35:14'),
	(1199, 'New', NULL, NULL, '2022-03-23 22:36:29'),
	(1200, 'New', NULL, NULL, '2022-03-23 22:37:36'),
	(1201, 'New', 2, NULL, '2022-03-23 23:01:45'),
	(1202, 'New', 2, NULL, '2022-03-23 23:36:28'),
	(1203, 'New', 2, NULL, '2022-03-23 23:57:40'),
	(1204, 'New', 3, NULL, '2022-03-24 01:43:27'),
	(1205, 'New', 3, NULL, '2022-03-24 05:37:34');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for table ims_proto.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `id_product` int(11) NOT NULL DEFAULT 0,
  `requested_quantity` int(11) DEFAULT NULL,
  `supplier_approval_status` varchar(50) DEFAULT 'New',
  `supp_avail_qty` int(11) DEFAULT NULL,
  `im_approval` varchar(50) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_order_items_products` (`id_product`),
  KEY `FK_order_items_orders` (`order_id`),
  CONSTRAINT `FK_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.order_items: ~11 rows (approximately)
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `id_product`, `requested_quantity`, `supplier_approval_status`, `supp_avail_qty`, `im_approval`, `date_created`, `last_updated`) VALUES
	(249, 1197, 127, 1, 'New', NULL, NULL, '2022-03-23 22:29:40', '2022-03-23 22:29:40'),
	(250, 1197, 126, 1, 'New', NULL, NULL, '2022-03-23 22:29:40', '2022-03-23 22:29:40'),
	(251, 1198, 127, 2, 'New', NULL, NULL, '2022-03-23 22:35:14', '2022-03-23 22:35:14'),
	(252, 1199, 127, 3, 'New', NULL, NULL, '2022-03-23 22:36:29', '2022-03-23 22:36:29'),
	(253, 1200, 127, 2, 'New', NULL, NULL, '2022-03-23 22:37:36', '2022-03-23 22:37:36'),
	(254, 1201, 124, 1, 'Rejected', 0, 'Canceled', '2022-03-23 23:01:45', '2022-03-24 05:37:44'),
	(255, 1202, 123, 5, 'New', NULL, NULL, '2022-03-23 23:36:28', '2022-03-23 23:36:28'),
	(256, 1202, 124, 3, 'New', NULL, NULL, '2022-03-23 23:36:28', '2022-03-23 23:36:28'),
	(257, 1203, 123, 2, 'New', NULL, NULL, '2022-03-23 23:57:40', '2022-03-23 23:57:40'),
	(258, 1203, 124, 1, 'New', NULL, NULL, '2022-03-23 23:57:40', '2022-03-23 23:57:40'),
	(259, 1203, 101, 2, 'New', NULL, NULL, '2022-03-23 23:57:40', '2022-03-23 23:57:40'),
	(260, 1204, 100, 3, 'Partial', 1, NULL, '2022-03-24 01:43:27', '2022-03-24 01:44:55'),
	(261, 1205, 100, 6, 'New', NULL, NULL, '2022-03-24 05:37:34', '2022-03-24 05:37:34');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

-- Dumping structure for table ims_proto.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `manufacturer` varchar(50) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `qty_avail` int(11) DEFAULT 0,
  `date_created` datetime DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `alert_level` int(11) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `unit_price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_products_suppliers` (`supplier_id`) USING BTREE,
  CONSTRAINT `FK_products_suppliers` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.products: ~54 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `category`, `product_name`, `product_code`, `description`, `manufacturer`, `supplier_id`, `qty_avail`, `date_created`, `last_updated`, `alert_level`, `image`, `unit_price`) VALUES
	(52, 'RRU', 'Multi-mode RRU1', 'RRU96-YC-5Z', 'RRU5501 for Multi-mode 1800MHz~2100MHz (4T4R*2, 4*60W)', 'Huawei', 1, 136, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 50, 'http://localhost:3000/images/telco/60.jpg', 1676),
	(53, 'RRU', '800 RRU', 'RRU96-YC-5Z', 'RRU5301 4T4R for 800MHz Trial', 'Huawei', 3, 94, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/58.jpg', 1261),
	(54, 'Transceiver', 'Optical Transceiver', 'OPT96-YC-5Z', 'Optical Transceiver,SFP+,1310nm,9.8G,-8.2dBm~+0.5dBm,-10.3dBm,LC,SM,1.4km', 'Nokia', 3, 95, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/59.jpg', 1175),
	(55, 'Power', 'BBU Power Module', 'FUN96-YC-5Z', 'Function Module,HERT BBU,WD2MUPEUe,Power and Environment interface Unit(-48V)', 'Huawei', 3, 88, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/57.jpg', 1993),
	(56, 'Power', 'BBU Power Module', 'FUN96-YC-5Z', 'Function Module,HERT BBU,WD2BBBUE,HERT BBU BOX', 'Nokia', 3, 57, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/55.jpg', 642),
	(57, 'Cooling', 'Cooling Fan Module', 'FUN96-YC-5Z', 'Function Module,HERT BBU,WD2E2FANF,2U FAN Module FanCfgPFAS3390', 'Nokia', 2, 21, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/53.jpg', 928),
	(58, 'Transmission', 'FBU', 'FIN96-YC-5Z', 'Finished Board Unit,HERT BBU,WD22UMPTe2,Universal Main Processing & Transmission Unit (2 Electrical FE/GE&2 Optical FE/GE/XGE,UMPTe2)', 'Ericsson', 2, 37, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/56.jpg', 715),
	(59, 'Cabling', 'BBU Cable', 'IT 96-YC-5Z', 'IT Equipment Cable,For BBU local maintenance adapter,0.38m,USB3.0 standard A Type Male,CC2P0.48B(S)-I,MP8(S)-III,LSZH', 'Ericsson', 2, 14, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/51.jpg', 692),
	(60, 'Baseband', 'Basband Unit', 'UNI96-YC-5Z', 'Universal Baseband Processing Unit e6', 'Huawei', 3, 21, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/49.jpg', 1215),
	(61, 'Cabling', 'Optical Cable', 'OPT96-YC-5Z', 'Optical Cable Parts,DLC/UPC,DLC/UPC,single mode,5m,2 cores,0.03m/0.03m,GYFJH-2G.657A2,7.0mm,2mm,LSZH,Armored branch', 'Nokia', 1, 94, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/47.jpg', 102),
	(62, 'Cabling', 'Single Mode Patch Cord', 'PAT96-YC-5Z', 'Patch Cord,LC/UPC,LC/UPC,SINGLE-MODE,5m,G.657A2,2mm,LSZH', 'Ericsson', 1, 86, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/54.jpg', 559),
	(63, 'Power', 'PDU', 'DC 96-YC-5Z', 'DC Power Distribution Unit', 'Ericsson', 1, 70, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 70, 'http://localhost:3000/images/telco/45.jpg', 490),
	(64, 'Cabling', 'Indicator Cable', 'SIN96-YC-5Z', 'Single Cable,Indicator Cable,LED D5G10,22UL1007R+22UL1007B,H2(2.5),HONET V600', 'Nokia', 1, 50, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/52.jpg', 671),
	(65, 'Power', 'Contactor DC 48V', 'CON96-YC-5Z', 'Contactor,Normally Open,DC48V Contact,400A,1a(SPST-NO),48Vdc Coil,Double Coil,DC Contactor', 'Nokia', 2, 61, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/43.jpg', 1786),
	(66, 'Power', 'Current Divider', 'CUR96-YC-5Z', 'Current Divider,500A,0W,25mV,1000ohm,0.3%,101*45*22mm', 'Huawei', 3, 54, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/41.jpg', 1119),
	(67, 'Power', 'Power Arrester', 'POW96-YC-5Z', 'Power Arrester,60kA,2000V,230VAC,Rail Mounting', 'Huawei', 1, 90, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/50.jpg', 138),
	(68, 'Rectifiers', 'HE Rectifier', 'R4896-YC-5Z', 'R4875G1-4000W High Efficiency Rectifier', 'Ericsson', 2, 86, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/39.jpg', 1030),
	(69, 'Power', 'PMU', 'POW96-YC-5Z', 'Power Monitor Unit', 'Huawei', 3, 60, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 65, 'http://localhost:3000/images/telco/48.jpg', 839),
	(70, 'Combiners', '2100 Combiner', '21096-YC-5Z', '2100M adjacent band combiner,dual, fixed cross over', 'Nokia', 3, 41, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/46.jpg', 1005),
	(71, 'RRU', '1400 RRU', 'RRU96-YC-5Z', 'RRU5301 4T4R for 1400MHz Trial', 'Nokia', 2, 25, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 30, 'http://localhost:3000/images/telco/44.jpg', 506),
	(72, 'Transceiver', 'Optical Transceiver', 'OPT96-YC-5Z', 'Optical Transceiver,SFP+,1310nm,6.144G,-8.4dBm~+0.5dBm,-13.8dBm,LC,SM,2km', 'Ericsson', 3, 3, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/42.jpg', 1315),
	(73, 'Antennas', 'Directional Antenna', 'DIR96-YC-5Z', 'Directional Antenna,D7X-690-960/690-960/1427-1528/1427-1528/3x(1695-2690)-65/65/65/65/65/65/65-14.5i/14.5i/17.5i/18i/18i/18i/18i-M/M/M/M/M/M/M-R-14*4.3-10 Female', 'Huawei', 3, 39, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/40.jpg', 1156),
	(74, 'Cabling', 'Indicator Cable', 'SIG96-YC-5Z', 'Signal Cable,AISG Communication cable,5m,D9M+D9(PS)(W),CC4P0.5PB(S),RC8SF(S)-I', 'Nokia', 1, 86, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/38.jpg', 1737),
	(75, 'Amplifiers', '1800 Amplifier', 'MTM96-YC-5Z', 'MTMA-1800&2100-Bypass 617-960/1427-1520-10-12dB-2BTSport6ANTport,AISG v2.0,8*4.3-10 Female (Long neck)', 'Nokia', 2, 7, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/36.jpg', 1316),
	(76, 'Combiners', 'Outdoor Combiner', 'OUT96-YC-5Z', 'Outdoor Combiner,TC-617-960/1427-1520/1690-2690-111,8*4.3-10 Female', 'Huawei', 3, 146, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/34.jpg', 1270),
	(77, 'Switches', 'SPU', 'SWI96-YC-5Z', 'Switch and Route Processing Unit A10(32G Memory)', 'Nokia', 3, 70, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/32.jpg', 402),
	(78, 'SFU', '2Tbps SFU', '2TB96-YC-5Z', '2Tbps Switch Fabric Unit D(SFUI-2T-D)', 'Huawei', 2, 13, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/30.jpg', 1896),
	(79, 'Power', '3KW Power Module', '30096-YC-5Z', '3000W AC&HVDC Power Module', 'Nokia', 1, 57, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/37.jpg', 578),
	(80, 'Transmission', '4 - 100G SFP', '4-P96-YC-5Z', '4-Port 100GBase-QSFP28 Integrated Line Processing Unit (LPUI-480)', 'Ericsson', 1, 47, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/28.jpg', 900),
	(81, 'Transmission', '2 - 100G SFP', '2-P96-YC-5Z', '2-Port 100GBase-QSFP28 + 24-Port 10GBase LAN/WAN-SFP+ Integrated Line Processing Unit (LPUI-480)', 'Ericsson', 1, 61, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/26.jpg', 769),
	(82, 'Transceiver', 'HS Optical Transceiver', 'HIG96-YC-5Z', 'High Speed Transceiver,QSFP28,1310nm,100G,-4.3dBm,4.5dBm,-8.6dBm,LC,SMF,10km', 'Ericsson', 3, 313, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/24.jpg', 1041),
	(83, 'Transceiver', 'SFP', 'OPT96-YC-5Z', 'Optical transceiver,SFP+,1310nm,10Gb/s,-8.2~0.5dBm,-12.6dBm,LC,SM,10km', 'Nokia', 2, 34, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/22.jpg', 900),
	(84, 'Cabling', 'Patch Cord', 'PAT96-YC-5Z', 'Patch Cord,LC/UPC,FC/UPC,Single-mode,10m,G.657A2,2mm', 'Huawei', 3, 64, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/20.jpg', 1278),
	(85, 'Transmission', 'ATN', 'ATN96-YC-5Z', 'ATN 910C-B - 2 channels DC entries, with 4*10GE(o), 8*10GE/GE/FE(o), 8*GE/FE(o), 8*GE/FE(e)', 'Huawei', 2, 28, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/18.jpg', 1690),
	(86, 'Transmission', 'NIC', 'NET96-YC-5Z', 'Network Interface Connector,8Bit 8Pin,Crystal Plug,Matching 25050014', 'Nokia', 2, 50, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/35.jpg', 716),
	(87, 'Transceiver', 'Optical Transceiver', 'OPT96-YC-5Z', 'Optical transceiver,SFP+,850nm,10Gb/s,-7.3~-1dBm,-9.9dBm,LC, MM,0.3km', 'Huawei', 2, 470, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/33.jpg', 308),
	(88, 'Cabling', 'Indicator Cable', 'SIG96-YC-5Z', 'Signal Cable,0.3m,MP8-II,CC4P0.5GY(S),MP8(S)-III,ATN Serial adapter cable', 'Huawei', 2, 63, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/31.jpg', 1189),
	(89, 'Cabling', 'Indicator Cable', 'SIN96-YC-5Z', 'Single Cable,Serial Port Cable,3m,D9F,CC2P0.32PWG1U,MP8-VI,S3026V', 'Ericsson', 2, 28, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/29.jpg', 1126),
	(90, 'Cabling', 'Patch Cord', 'PAT96-YC-5Z', 'Patch Cord,LC/UPC,FC/UPC,Single-mode,10m,G.657A2,2mm,PE bags', 'Ericsson', 3, 48, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/27.jpg', 1960),
	(91, 'Cabling', 'Patch Cord', 'PAT96-YC-5Z', 'Patch cord-FC/PC-LC/PC-Multimode-A1b-2mm-10m-PVC-Orange', 'Ericsson', 3, 56, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/25.jpg', 627),
	(92, 'Transmission', 'Attenuator', 'FIX96-YC-5Z', 'Fixed Optical Attenuator,1260nm~1620nm-5dB-LC/PC-45dB', 'Nokia', 1, 38, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/16.jpg', 950),
	(93, 'Cabling', 'M8A DC Cable', 'CX696-YC-5Z', 'CX600-X2-M8A Integrated DC Chassis Components', 'Nokia', 3, 18, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/23.jpg', 869),
	(94, 'Baseband', 'Baseband Processor', 'MAI96-YC-5Z', 'Main Processing Unit K1', 'Ericsson', 3, 79, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/21.jpg', 1397),
	(95, 'Power', 'DC PSU', 'DC 96-YC-5Z', 'DC Power Supply Unit', 'Ericsson', 3, 39, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/19.jpg', 480),
	(96, 'Transmission', 'CX600', 'CX696-YC-5Z', 'CX600-X2-M8A Integrated AC 2400W Chassis Components', 'Nokia', 3, 56, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/17.jpg', 1904),
	(97, 'Power', 'AC PSU', '24096-YC-5Z', '2400W AC Power Module', 'Huawei', 2, 64, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/15.jpg', 385),
	(98, 'Transmission', 'NPU', 'NET96-YC-5Z', 'Network Processing Unit (NPU-1T)', 'Nokia', 1, 51, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/13.jpg', 1808),
	(99, 'Transmission', '1 - 100G SFP', '1-P96-YC-5Z', '1-Port 100GBase-QSFP28+MACsec Interface Card', 'Huawei', 2, 65, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/14.jpg', 190),
	(100, 'Transmission', '10 - 100G SFP', '10-96-YC-5Z', '10-Port 10GBase LAN/WAN-SFP+ Physical Interface Card(PIC)', 'Huawei', 3, 68, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/11.jpg', 1122),
	(101, 'Transceiver', 'Optical Transceiver', 'OPT96-YC-5Z', 'Optical transceiver(eSFP,1310nm,1.25Gb/s,-9dBm~-3dBm,-20dBm,LC,SM,10km)', 'Huawei', 2, 46, '2022-02-05 18:28:46', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/9.jpg', 1142),
	(106, 'Transmission', 'Basestation', 'NOK-001-FLEXI', 'Flexi Base Station (5g)', 'Nokia', 2, NULL, '2022-02-06 01:23:49', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/12.jpg', 343),
	(107, 'Transmission', 'Basestation', 'NOK-001-FLEXI', 'Flexi Base Station (5g)', 'Nokia', 2, 0, '2022-02-06 01:24:48', '2022-03-23 22:54:11', 0, 'http://localhost:3000/images/telco/10.jpg', 1986),
	(123, 'Transmission', 'Router', '123457', 'Test Description', 'Ericsson', 2, 0, '2022-03-07 19:15:47', '2022-03-23 22:54:11', 123, 'http://localhost:3000/images/telco/7.jpg', 1205),
	(124, 'Transmission', 'Router', '1234567', 'Huawei router (16 ports)', 'Huawei', 2, 0, '2022-03-07 19:16:01', '2022-03-23 22:54:11', 10, 'http://localhost:3000/images/telco/8.jpg', 1867);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

-- Dumping structure for table ims_proto.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `onboard_date` datetime DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contact_email` varchar(50) DEFAULT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_suppliers_company_info` (`company_id`),
  CONSTRAINT `FK_suppliers_company_info` FOREIGN KEY (`company_id`) REFERENCES `company_info` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.suppliers: ~3 rows (approximately)
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` (`id`, `company_name`, `address`, `active`, `onboard_date`, `last_updated`, `contact_email`, `company_id`) VALUES
	(1, 'Network Parts Ltd.', '1 London Road, London, NW1', 1, '2022-02-04 10:46:09', '2022-03-07 14:33:27', 'imsdemosystem@outlook.com', 1),
	(2, 'GTX Telco Ltd', '36 Spitfire Close, Huntingdon, Cambs, PE1 3DC', 1, '2022-02-04 10:46:11', '2022-03-07 14:33:28', 'imsdemosystem@outlook.com', 2),
	(3, 'Better Networks Ltd.', '43 Vastern Road, Reading, RG1 8DJ', 1, '2022-02-04 10:46:12', '2022-03-07 14:33:30', 'imsdemosystem@outlook.com', 3);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;

-- Dumping structure for table ims_proto.sys_users
CREATE TABLE IF NOT EXISTS `sys_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(150) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT 1,
  `role` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_sys_users_sys_user_roles` (`role`),
  KEY `FK_sys_users_company_info` (`company_id`),
  CONSTRAINT `FK_sys_users_company_info` FOREIGN KEY (`company_id`) REFERENCES `company_info` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_sys_users_sys_user_roles` FOREIGN KEY (`role`) REFERENCES `sys_user_roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.sys_users: ~3 rows (approximately)
/*!40000 ALTER TABLE `sys_users` DISABLE KEYS */;
INSERT INTO `sys_users` (`id`, `name`, `email`, `password`, `company_id`, `active`, `role`, `date_created`) VALUES
	(1, 'Karl Webster', 'karl.webster@outlook.com', '$2a$10$dt1mYMatlR9lZww9H8Q9EubIrPMZGwotvmoALmehw3n7NXXeHG86a', 4, 1, 1, '2022-02-19 20:51:30'),
	(2, 'Sample User', 'deactivated.user', '$2a$10$dt1mYMatlR9lZww9H8Q9EubIrPMZGwotvmoALmehw3n7NXXeHG86a', 2, 0, 2, '2022-02-19 20:51:30'),
	(3, 'Jane', 'Jane@gtxnetworks.com', '$2a$10$dt1mYMatlR9lZww9H8Q9EubIrPMZGwotvmoALmehw3n7NXXeHG86a', 2, 1, 2, '2022-02-19 20:51:30'),
	(4, 'Jane', 'Jack@betternetworks.com', '$2a$10$dt1mYMatlR9lZww9H8Q9EubIrPMZGwotvmoALmehw3n7NXXeHG86a', 3, 1, 2, '2022-02-19 20:51:30');
/*!40000 ALTER TABLE `sys_users` ENABLE KEYS */;

-- Dumping structure for table ims_proto.sys_user_roles
CREATE TABLE IF NOT EXISTS `sys_user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL,
  `content` varchar(100) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table ims_proto.sys_user_roles: ~2 rows (approximately)
/*!40000 ALTER TABLE `sys_user_roles` DISABLE KEYS */;
INSERT INTO `sys_user_roles` (`id`, `role_name`, `content`, `date_created`) VALUES
	(1, 'admin', '*', '2022-03-14 19:33:24'),
	(2, 'supplier', 'supplierorders', '2022-03-14 19:35:32');
/*!40000 ALTER TABLE `sys_user_roles` ENABLE KEYS */;

-- Dumping structure for trigger ims_proto.order_items_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `order_items_before_insert` BEFORE INSERT ON `order_items` FOR EACH ROW BEGIN
SET NEW.date_created = NOW();

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger ims_proto.products_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `products_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
SET NEW.date_created = NOW();

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
