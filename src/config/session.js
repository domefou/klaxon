// session.js
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();



/**
 * @file session.js
 * @description Configure la gestion des sessions Express en utilisant une base MySQL comme store persistant.
 *
 * @dependencies
 * - express-session : Middleware pour gérer les sessions dans une application Express
 * - express-mysql-session : Store de session compatible avec MySQL
 * - dotenv : Charge les variables d’environnement à partir du fichier `.env`
 *
 * @env
 * - DB_HOST {string} : Adresse de la base MySQL
 * - DB_PORT {number} : Port MySQL (3306 par défaut)
 * - DB_USER {string} : Nom d'utilisateur MySQL
 * - DB_PASSWORD {string} : Mot de passe MySQL
 * - DB_NAME {string} : Nom de la base de données
 * - SECRET_KEY {string} : Clé secrète utilisée pour signer les sessions
 *
 * @store
 * - sessionStore : Instance MySQLStore configurée pour stocker les sessions
 *
 * @session options
 * - secret : Utilisé pour signer l'identifiant de session
 * - resave : Empêche la session d’être resauvegardée si elle n’a pas été modifiée
 * - saveUninitialized : Empêche la sauvegarde des sessions non initialisées
 * - store : Persistance des sessions via MySQL
 *
 * @exports {Function} : Middleware express-session prêt à être utilisé dans l'app Express
 */

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
});
