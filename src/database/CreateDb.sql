/**
 * @description Création de la base de données principale du projet Klaxon.
 * @details
 * - Encodage : UTF-8 (utf8mb4) pour prise en charge étendue des caractères
 * - Collation : unicode_ci pour comparaison insensible à la casse
 */
CREATE DATABASE IF NOT EXISTS klaxon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE klaxon;

/**
 * @table users
 * @description Stocke les informations personnelles et d’authentification des utilisateurs.
 * @fields
 * - id_user : Identifiant unique de l’utilisateur
 * - nom, prenom, telephone, mail : Coordonnées
 * - password : Mot de passe chiffré (nullable)
 * - created_at, updated_at : Timestamps pour suivi des modifications
 * - role : Rôle de l’utilisateur ('user' ou 'admin')
 */
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(70) NOT NULL,
    prenom VARCHAR(70) NOT NULL,
    telephone VARCHAR(10) NOT NULL,
    mail VARCHAR(70) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

/**
 * @table agence
 * @description Représente une agence de départ ou d’arrivée pour les trajets.
 * @fields
 * - id_agence : Identifiant unique de l’agence
 * - agence : Nom de l’agence
 */
CREATE TABLE agence (
    id_agence INT PRIMARY KEY AUTO_INCREMENT,
    agence VARCHAR(70) NOT NULL
);

/**
 * @table trajet
 * @description Contient les informations relatives aux trajets enregistrés.
 * @relations
 * - id_user : FK vers users (conducteur ou passager)
 * - id_agence_depart, id_agence_arrivee : FKs vers agences
 * @fields
 * - Dates et heures de départ/arrivée
 * - place : Nombre de places disponibles
 */
CREATE TABLE trajet (
    id_trajet INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_agence_depart INT NOT NULL,
    id_agence_arrivee INT NOT NULL,
    date_depart DATE,
    heure_depart TIME,
    date_arrivee DATE,
    heure_arrivee TIME,
    place INT,
    FOREIGN KEY (id_user) REFERENCES users (id_user),
    FOREIGN KEY (id_agence_depart) REFERENCES agence (id_agence),
    FOREIGN KEY (id_agence_arrivee) REFERENCES agence (id_agence)
);

/**
 * @table sessions
 * @description Gère les sessions utilisateur pour la persistance des connexions.
 * @fields
 * - session_id : Identifiant de session
 * - expires : Timestamp Unix d’expiration
 * - data : Contenu sérialisé de la session
 */
CREATE TABLE sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT
);