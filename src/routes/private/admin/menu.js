const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const secure = require('../../../middleware/secure');
const Trajet = require('../../../models/trajets');
const Agence = require('../../../models/agence');
const User = require('../../../models/users');


/**
 * @route GET /
 * @middleware checkJWT : Authentifie l'utilisateur avec JWT
 * @description Affiche le menu d'administration, avec tous les trajets à venir, les agences et les utilisateurs.
 *
 * @workflow
 * 1. Récupère les éventuels messages de session (succès/erreur)
 * 2. Nettoie les messages pour éviter qu'ils ne persistent après le rendu
 * 3. Récupère :
 *    - Les trajets à venir (`Trajet` avec `date_depart` + `heure_depart` > `Date.now()`)
 *    - Les agences (`Agence.findAll`)
 *    - Les utilisateurs (`User.findAll`)
 * 4. Rendu de la vue `adminMenu` avec les données
 *
 * @view adminMenu
 * @access Admin authentifié (via `checkJWT`)
 */

router.get('/', secure.checkJWT, async (req, res) => {
    try {
        // 💬 Récupérer les messages avant nettoyage
        const successMessage = req.session.successMessage || null;
        const errorMessage = req.session.errorMessage || null;

        // 🧹 Nettoyer les messages de session AVANT le rendu
        req.session.successMessage = null;
        req.session.errorMessage = null;

        // 📦 Récupération des données
        const trajets = await Trajet.findAll({
            where: {
                [Op.or]: [
                    {
                        date_depart: {
                            [Op.gt]: new Date() // Date future
                        }
                    },
                    {
                        date_depart: {
                            [Op.eq]: new Date().toISOString().split('T')[0] // Date d’aujourd’hui
                        },
                        heure_depart: {
                            [Op.gt]: new Date().toTimeString().split(' ')[0] // Heure future
                        }
                    }
                ]
            },
            include: [
                { model: Agence, as: 'depart' },
                { model: Agence, as: 'arrivee' }
            ]
        });

        const agences = await Agence.findAll();
        const users = await User.findAll();

        // 🎨 Rendu de la vue avec tous les éléments
        res.render('adminMenu', {
            user: req.user,
            trajets,
            agences,
            users,
            successMessage,
            errorMessage
        });

    } catch (error) {
        console.error('❌ Erreur chargement trajets :', error.message || error);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;