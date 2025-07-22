const { Sequelize } = require('sequelize');
require('dotenv').config();



/**
 * @file database.js
 * @description Initialise une instance Sequelize connectée à une base MySQL via les variables d'environnement.
 * @requires dotenv : Pour charger les variables du fichier `.env`
 * @requires sequelize : ORM utilisé pour la communication avec MySQL
 *
 * @env DB_NAME {string} : Nom de la base de données
 * @env DB_USER {string} : Nom d'utilisateur MySQL
 * @env DB_PASSWORD {string} : Mot de passe MySQL
 * @env DB_HOST {string} : Hôte (généralement 'localhost' ou une IP)
 * @env DB_PORT {number} : Port MySQL (par défaut : 3306)
 *
 * @config
 * - dialect : 'mysql'
 * - logging : false (désactive l'affichage des requêtes SQL)
 *
 * @exports sequelize : Instance connectée à utiliser dans l'application
 */

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);


module.exports = sequelize;