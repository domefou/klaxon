const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


/**
 * @model User
 * @description Représente un utilisateur du système avec ses données personnelles, ses identifiants et son rôle.
 * 
 * @fields
 * - id_user {INTEGER} : Identifiant unique, clé primaire, auto-incrémenté
 * - nom {STRING(70)} : Nom de famille de l'utilisateur (obligatoire)
 * - prenom {STRING(70)} : Prénom de l'utilisateur (obligatoire)
 * - telephone {STRING(10)} : Numéro de téléphone (obligatoire)
 * - mail {STRING(70)} : Adresse email (obligatoire, unique, validée comme email)
 * - password {STRING(255)} : Mot de passe hashé (obligatoire)
 * - created_at {DATE} : Date de création du compte
 * - updated_at {DATE} : Dernière mise à jour du compte
 * - role {ENUM} : Rôle de l’utilisateur (valeurs possibles : 'user', 'admin')
 * 
 * @options
 * - tableName : 'users' (nom explicite de la table SQL)
 * - timestamps : true (active les timestamps Sequelize)
 * - createdAt : mappé sur 'created_at'
 * - updatedAt : mappé sur 'updated_at'
 *
 * @note Les validations comme `isEmail` renforcent la qualité des données.
 */

const User = sequelize.define('users', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
