const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


/**
 * @model Agence
 * @description Représente une agence dans le système (lieu de départ ou d'arrivée des trajets).
 * 
 * @fields
 * - id_agence {INTEGER} : Identifiant unique, clé primaire, auto-incrémenté
 * - agence {STRING(70)} : Nom de l’agence (obligatoire)
 * 
 * @options
 * - tableName : 'agence' (nom réel de la table dans la base de données)
 * - timestamps : false (désactive les colonnes Sequelize par défaut : `createdAt` et `updatedAt`)
 *
 * @usage Utilisé dans les relations avec le modèle `Trajet` (départ et arrivée)
 */

const Agence = sequelize.define('agence', {
    id_agence: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    agence: {
        type: DataTypes.STRING(70),
        allowNull: false
    }
}, {
    tableName: 'agence',
    timestamps: false
});

module.exports = Agence;
