CREATE TABLE evenements (
id_evenement INT NOT NULL AUTO_INCREMENT, 
nom VARCHAR(50), 
date_creation DATE, 
date_debut DATE, 
date_fin DATE, 
personnes_maximum INT, 
lieu VARCHAR(250),
PRIMARY KEY(id_evenement)
);

CREATE TABLE inscriptions (
id_inscription INT NOT NULL AUTO_INCREMENT,
id_evenement INT,
prenom VARCHAR(50),
nom VARCHAR(50),
date_inscription DATE,
PRIMARY KEY(id_inscription)
);

ALTER TABLE inscriptions ADD FOREIGN KEY(id_evenement) REFERENCES evenements(id_evenement);

-- Procédures

-- Création d'un évènement

DELIMITER//
CREATE PROCEDURE creation_evenement(IN nom VARCHAR(50), IN date_creation DATE, IN date_debut DATE, IN date_fin DATE, IN personnes_maximum INT, IN lieu VARCHAR(250))
BEGIN
INSERT INTO evenements VALUES(NULL, nom, date_creation, date_debut, date_fin, personnes_maximum, lieu); END

-- Inscription d'une personne

CREATE PROCEDURE inscription(IN id_evenement INT, IN prenom VARCHAR(50), IN nom VARCHAR(50), IN date_inscription DATE)
BEGIN
INSERT INTO inscriptions VALUES(NULL, id_evenement, prenom, nom, date_inscription);
END

-- Desinscription

CREATE PROCEDURE desinscription(IN p_prenom VARCHAR(50),IN p_nom VARCHAR(50))
BEGIN
DELETE FROM inscriptions WHERE prenom = p_prenom AND nom = p_nom;
END

-- Modifications des dates de début et fin d'un évènement

CREATE PROCEDURE modif_dateEvenement(IN id_evenement INT, IN date_debut DATE, IN date_fin DATE)
BEGIN
UPDATE evenements set date_debut = nouveau_debut, date_fin = nouvelle_fin WHERE event_id = id_evenement; 
END

-- Supprésion d'un évènement et des personnes associées

CREATE PROCEDURE supp_evenement(IN id_evenement INT)
BEGIN
DELETE FROM inscriptions WHERE id_evenement = evenement_id;
DELETE FROM evenements WHERE evenement_id = id_evenement;
END