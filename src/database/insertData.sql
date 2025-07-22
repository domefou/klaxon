/**
 * @action ALTER TABLE
 * @description Définit manuellement la prochaine valeur de l'AUTO_INCREMENT à 1 pour la table `users`.
 * @note Utile si la table vient d'être vidée et qu'on souhaite recommencer l'indexation à partir de 1.
 */
ALTER TABLE users AUTO_INCREMENT = 1;

/**
 * @action LOAD DATA INFILE
 * @description Importe les données utilisateur depuis un fichier CSV dans la table `users`.
 * @params
 * - Chemin : 'klaxon/csv/users.csv' (vérifie que le chemin est exact et accessible par le serveur)
 * - FIELDS TERMINATED BY ',' : les champs sont séparés par des virgules
 * - ENCLOSED BY '"' : les valeurs sont entourées de guillemets
 * - LINES TERMINATED BY '\n' : chaque ligne se termine par un retour à la ligne
 * - Colonnes : nom, prenom, telephone, mail
 */
LOAD DATA INFILE 'klaxon/csv/users.csv' INTO /*verifier bien le chemin des fichier .csv*/
TABLE users FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' (nom, prenom, telephone, mail);

/**
 * @action INSERT INTO
 * @description Ajoute un utilisateur par défaut avec rôle 'admin' dans la table `users`.
 * @fields
 * - nom, prenom : valeurs génériques pour l’administrateur
 * - telephone : numéro fictif
 * - mail : (à compléter – il semble manquant dans ta requête)
 * - role : défini à 'admin'
 */
INSERT INTO
    users (
        nom,
        prenom,
        telephone,
        mail,
        role
    )
VALUES (
        'admin',
        'admin',
        '0000000000',
        'admin@email.fr',
        'admin'
    );

/*initialiser votre mot de passe depuis la page initialiser son mot de passe*/

/**
 * @action ALTER TABLE
 * @description Définit manuellement la prochaine valeur de l'AUTO_INCREMENT à 1 pour la table `agence`.
 * @note Utile si la table vient d'être vidée et qu'on souhaite recommencer l'indexation à partir de 1.
 */
ALTER TABLE agence AUTO_INCREMENT = 1;

/**
 * @action LOAD DATA INFILE
 * @description Importe les noms d’agences depuis un fichier CSV vers la table `agence`.
 * @params
 * - Chemin : 'klaxon/csv/agences.csv' (vérifie que le chemin est bien accessible au serveur SQL)
 * - FIELDS TERMINATED BY '' : séparateur de champs — actuellement vide, doit être précisé (souvent une virgule `','`)
 * - ENCLOSED BY '' : délimiteur de texte — ici vide, à définir si les valeurs sont entourées de guillemets (ex: `"`)
 * - LINES TERMINATED BY '\n' : chaque ligne du fichier CSV correspond à une entrée
 * - Colonne ciblée : agence
 * @note Attention, les valeurs pour TERMINATED BY et ENCLOSED BY doivent être valides pour que l’import fonctionne. 
 */
LOAD DATA INFILE 'klaxon/csv/agences.csv' INTO /*verifier bien le chemin des fichier .csv*/
TABLE agence FIELDS TERMINATED BY '' ENCLOSED BY '' LINES TERMINATED BY '\n' (agence);