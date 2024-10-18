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

DELIMITER//
CREATE PROCEDURE creation_evenement(IN nom VARCHAR(50), IN date_creation DATE, IN date_debut DATE, IN date_fin DATE, IN personnes_maximum INT, IN lieu VARCHAR(250))
BEGIN
INSERT INTO evenements VALUES(NULL, nom, date_creation, date_debut, date_fin, personnes_maximum, lieu);
END//

CREATE PROCEDURE inscription(IN id_evenement INT, IN prenom VARCHAR(50), IN nom VARCHAR(50), IN date_inscription DATE)
BEGIN
DECLARE compteur_inscrit INT;
DECLARE compteur_max INT;
SELECT COUNT(*) INTO compteur_inscrit FROM inscriptions WHERE inscription.id_evenement = evenements.id_evenement;
SELECT personnes_maximum INTO compteur_max FROM evenements WHERE id = id_evenement;
IF compteur_inscrit < compteur_max THEN
INSERT INTO inscriptions VALUES(NULL, id_evenement, prenom, nom, date_inscription);
ELSE 
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Le nombre maximum de personnes à été atteint";
END IF;
END//

CREATE PROCEDURE desinscription(
IN p_prenom VARCHAR(50),
IN p_nom VARCHar(50)
)
BEGIN
DELETE FROM inscriptions
WHERE prenom = p_prenom AND nom = p_nom;
END//

CREATE PROCEDURE supp_evenement(
IN id_evenement INT
)
BEGIN
DELETE FROM evenements WHERE id = id_evenement;
DELETE FROM inscriptions WHERE evenements.id_evenement = inscriptions.id_evenement;
END//

CREATE PROCEDURE modif_dateEvenement(
IN id_evenement INT,
IN date_debut DATE,
IN date_fin DATE
)
BEGIN
UPDATE evenements set date_debut = nouveau_debut, date_fin = nouvelle_fin WHERE id = id_evenement;
END//

DELIMITER;


-- Procédure d'inscription modifiée et qui fonctionne mais sans le compteur à voir pour le mettre en place sur javascript

CREATE PROCEDURE inscription(IN id_evenement INT, IN prenom VARCHAR(50), IN nom VARCHAR(50), IN date_inscription DATE)
BEGIN
INSERT INTO inscriptions VALUES(NULL, id_evenement, prenom, nom, date_inscription);
END//