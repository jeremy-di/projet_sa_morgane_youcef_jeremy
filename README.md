### Guide d'installation et de configuration du projet lsa

#### Étape 1 : Installation des dépendances
Avant de commencer, vous devez installer les dépendances nécessaires au projet. Exécutez la commande suivante dans le répertoire racine du projet :

npm install


#### Étape 2 : Mise en place de la base de données
Une fois les dépendances installées, vous devez configurer la base de données MySQL. Un fichier `bddCentrale.sql` est fourni pour l'initialiser la base de données.

mysql -u utilisateur -p mot_de_passe < chemin/vers/bddCentrale.sql


#### Étape 3 : Injecter les fichiers json dans mongoDB
Pour lancer l'injection des données json dans les collections MongoDB, exécutez la commande suivante :

npm run mongo


#### Étape 4 : Lancer le serveur
Une fois la base de données mise en place, vous pouvez lancer le serveur en exécutant la commande suivante :

npm start


