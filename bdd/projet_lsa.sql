-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 19 oct. 2024 à 15:31
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_lsa`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `creation_evenement` (IN `nom` VARCHAR(50), IN `date_creation` DATE, IN `date_debut` DATE, IN `date_fin` DATE, IN `personnes_maximum` INT, IN `lieu` VARCHAR(250))   BEGIN
INSERT INTO evenements VALUES(NULL, nom, date_creation, date_debut, date_fin, personnes_maximum, lieu); END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `desinscription` (IN `p_prenom` VARCHAR(50), IN `p_nom` VARCHAR(50))   BEGIN
DELETE FROM inscriptions
WHERE prenom = p_prenom AND nom = p_nom;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `inscription` (IN `id_evenement` INT, IN `prenom` VARCHAR(50), IN `nom` VARCHAR(50), IN `date_inscription` DATE)   BEGIN
INSERT INTO inscriptions VALUES(NULL, id_evenement, prenom, nom, date_inscription);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `modif_dateEvenement` (IN `event_id` INT(50), IN `nouveau_debut` DATE, IN `nouvelle_fin` DATE)   BEGIN
UPDATE evenements set date_debut = nouveau_debut, date_fin = nouvelle_fin WHERE event_id = id_evenement; END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supp_evenement` (IN `evenement_id` INT)   BEGIN
DELETE FROM inscriptions WHERE id_evenement = evenement_id;
DELETE FROM evenements WHERE evenement_id = id_evenement;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `evenements`
--

CREATE TABLE `evenements` (
  `id_evenement` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `personnes_maximum` int(11) DEFAULT NULL,
  `lieu` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

CREATE TABLE `inscriptions` (
  `id_inscription` int(11) NOT NULL,
  `id_evenement` int(11) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `date_inscription` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD PRIMARY KEY (`id_evenement`);

--
-- Index pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id_inscription`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `evenements`
--
ALTER TABLE `evenements`
  MODIFY `id_evenement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  MODIFY `id_inscription` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=620;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
