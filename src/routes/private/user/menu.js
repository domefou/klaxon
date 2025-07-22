const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const secure = require('../../../middleware/secure');
const Trajet = require('../../../models/trajets');
const Agence = require('../../../models/agence');


/**
 * @route GET /
 * @middleware checkJWT : Authentifie l’utilisateur via JWT
 * @description Affiche la page d’accueil utilisateur avec la liste des trajets à venir et toutes les agences disponibles.
 *
 * @workflow
 * 1. Récupère les éventuels messages de session (`successMessage`, `errorMessage`)
 * 2. Vide les messages pour ne pas les conserver après le rendu
 * 3. Récupère :
 *    - Les trajets futurs (date/heure de départ > maintenant)
 *    - Les agences disponibles
 * 4. Passe toutes les données à la vue `userMenu` pour affichage
 *
 * @view userMenu
 * @access Utilisateur authentifié
 */

router.get('/', secure.checkJWT, async (req, res) => {
    try {
        // Récupérer les messages AVANT de les nettoyer
        const successMessage = req.session.successMessage || null;
        const errorMessage = req.session.errorMessage || null;

        // Nettoyer la session
        req.session.successMessage = null;
        req.session.errorMessage = null;

        // Récupérer tous les trajets avec les agences associées
        const maintenant = new Date();
        const dateAujourdHui = maintenant.toISOString().split('T')[0];
        const heureMaintenant = maintenant.toTimeString().split(' ')[0];

        const trajets = await Trajet.findAll({
            where: {
                [Op.or]: [
                    {
                        date_depart: {
                            [Op.gt]: dateAujourdHui
                        }
                    },
                    {
                        date_depart: dateAujourdHui,
                        heure_depart: {
                            [Op.gt]: heureMaintenant
                        }
                    }
                ]
            },
            include: [
                { model: Agence, as: 'depart' },
                { model: Agence, as: 'arrivee' }
            ]
        });

        // Récupérer toutes les agences pour le formulaire
        const agences = await Agence.findAll();

        // Rendu de la vue avec toutes les données nécessaires
        res.render('userMenu', {
            user: req.user,
            trajets,
            agences,
            successMessage,
            errorMessage
        });

    } catch (error) {
        console.error('❌ Erreur chargement trajets :', error.message || error);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;


