const express = require('express');
const router = express.Router();
const User = require('../../../models/users'); // modèle Sequelize

/**
 * @module GetUserProfileRoute
 * @description Route Express permettant de récupérer les informations publiques d’un utilisateur via son identifiant.
 * 
 * @dependencies
 * - express : Framework serveur Node.js
 * - Sequelize : ORM utilisé pour interagir avec la base de données (User.findByPk)
 * 
 * @route GET /:idUser
 * @access Public ou protégé selon intégration avec JWT (ici non sécurisé)
 * 
 * @param {string} idUser - Identifiant de l'utilisateur à récupérer (extrait depuis l'URL)
 * 
 * @returns {Object} JSON contenant les informations suivantes :
 * - nom {string}
 * - telephone {string}
 * - mail {string}
 * 
 * @errors
 * - 404 : Si aucun utilisateur ne correspond à l’identifiant
 * - 500 : Si une erreur serveur survient lors de la requête
 *
 * @usage
 * - Utilisable pour afficher les infos dans un formulaire de profil, pour l’administration, ou à des fins de vérification.
 */

router.get('/:idUser', async (req, res) => {

    try {
        const user = await User.findByPk(req.params.idUser);
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

        res.json({
            nom: user.nom,
            telephone: user.telephone,
            email: user.mail
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;