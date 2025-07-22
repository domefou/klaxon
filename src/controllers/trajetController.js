const Trajet = require('../models/trajets');
const User = require('../models/users');
const Agence = require('../models/agence');



/**
 * @function getAllTrajets
 * @description Récupère tous les trajets en base avec leurs relations associées.
 * 
 * @returns {Promise<Array>} Liste complète des trajets incluant :
 * - auteur : utilisateur lié au trajet (via model User, alias 'auteur')
 * - depart : agence de départ (via model Agence, alias 'depart')
 * - arrivee : agence d’arrivée (via model Agence, alias 'arrivee')
 *
 * @note Utilise Sequelize `findAll` avec jointures grâce à l'option `include`.
 * @async Cette fonction est asynchrone, retourne une promesse.
 */

exports.getAllTrajets = async () => {
    return await Trajet.findAll({
        include: [
            { model: User, as: 'auteur' },
            { model: Agence, as: 'depart' },
            { model: Agence, as: 'arrivee' }
        ]
    });
};
