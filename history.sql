-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2021 at 11:35 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank`
--

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(10) NOT NULL,
  `transactionId` int(2) DEFAULT NULL,
  `accountId` int(10) NOT NULL,
  `userId` int(10) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `transactionId`, `accountId`, `userId`, `amount`, `date`) VALUES
(1, 1, 0, 1, '0.00', '2021-09-25 09:15:07'),
(2, 2, 1, 1, '0.00', '2021-09-25 09:15:07'),
(3, 1, 0, 2, '0.00', '2021-09-25 09:15:07'),
(4, 2, 2, 2, '0.00', '2021-09-25 09:15:07'),
(5, 1, 0, 3, '0.00', '2021-09-25 09:15:07'),
(6, 2, 3, 3, '0.00', '2021-09-25 09:15:07'),
(7, 1, 0, 4, '0.00', '2021-09-25 09:15:07'),
(8, 2, 4, 4, '0.00', '2021-09-25 09:15:07'),
(9, 1, 0, 5, '0.00', '2021-09-25 09:15:07'),
(10, 2, 5, 5, '0.00', '2021-09-25 09:15:07'),
(11, 1, 0, 6, '0.00', '2021-09-25 09:15:07'),
(12, 2, 6, 6, '0.00', '2021-09-25 09:15:07'),
(13, 2, 7, 1, '0.00', '2021-09-25 09:15:07'),
(14, 2, 8, 2, '0.00', '2021-09-25 09:15:07'),
(15, 3, 1, 0, '500.00', '2021-09-25 09:15:07'),
(16, 3, 2, 0, '1000.00', '2021-09-25 09:15:07'),
(17, 3, 5, 0, '5000.00', '2021-09-25 09:15:07'),
(18, 4, 1, 0, '100.00', '2021-09-25 09:15:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
