const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Agence = require('./agence');
const User = require('./users');


/**
 * @model Trajet
 * @description Représente un trajet effectué par un utilisateur entre deux agences, avec date, heure et nombre de places.
 * 
 * @fields
 * - id_trajet {INTEGER} : Identifiant unique du trajet (clé primaire auto-incrémentée)
 * - id_user {INTEGER} : Référence vers l’utilisateur (FK)
 * - id_agence_depart {INTEGER} : Référence vers l’agence de départ (FK)
 * - id_agence_arrivee {INTEGER} : Référence vers l’agence d’arrivée (FK)
 * - date_depart {DATEONLY} : Date du départ
 * - heure_depart {TIME} : Heure du départ
 * - date_arrivee {DATEONLY} : Date d’arrivée
 * - heure_arrivee {TIME} : Heure d’arrivée
 * - place {INTEGER} : Nombre de places disponibles
 * 
 * @options
 * - tableName : 'trajet'
 * - timestamps : false (pas de champs `createdAt` / `updatedAt` Sequelize)
 */

const Trajet = sequelize.define('trajet', {
    id_trajet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_agence_depart: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_agence_arrivee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_depart: DataTypes.DATEONLY,
    heure_depart: DataTypes.TIME,
    date_arrivee: DataTypes.DATEONLY,
    heure_arrivee: DataTypes.TIME,
    place: DataTypes.INTEGER
}, {
    tableName: 'trajet',
    timestamps: false
});

// 🧩 Relations

/**
 * @associations
 * - Trajet.belongsTo(User, { as: 'auteur' }) : Un trajet appartient à un utilisateur (auteur)
 * - User.hasMany(Trajet, { as: 'trajets' }) : Un utilisateur peut avoir plusieurs trajets

 * - Trajet.belongsTo(Agence, { as: 'depart' }) : Une agence est le point de départ du trajet
 * - Trajet.belongsTo(Agence, { as: 'arrivee' }) : Une agence est le point d’arrivée

 * - Agence.hasMany(Trajet, { as: 'depuis' }) : Une agence peut être le départ de plusieurs trajets
 * - Agence.hasMany(Trajet, { as: 'vers' }) : Une agence peut être la destination de plusieurs trajets
 */

Trajet.belongsTo(User, { foreignKey: 'id_user', as: 'auteur' });
User.hasMany(Trajet, { foreignKey: 'id_user', as: 'trajets' });

Trajet.belongsTo(Agence, { foreignKey: 'id_agence_depart', as: 'depart' });
Trajet.belongsTo(Agence, { foreignKey: 'id_agence_arrivee', as: 'arrivee' });

Agence.hasMany(Trajet, { foreignKey: 'id_agence_depart', as: 'depuis' });
Agence.hasMany(Trajet, { foreignKey: 'id_agence_arrivee', as: 'vers' });

module.exports = Trajet;
