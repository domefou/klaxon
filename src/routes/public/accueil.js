const express = require('express');
const router = express.Router();
const { getAllTrajets } = require('../../controllers/trajetController');

/**
 * @module AccueilRoute
 * @description Route Express affichant tous les trajets via la vue `accueil`.
 * 
 * @dependencies
 * - express : Framework serveur Node.js
 * - getAllTrajets : Fonction du contrôleur qui récupère tous les trajets avec leurs relations (auteur, agences)
 * 
 * @route GET /
 * @access Public (sauf si sécurisation ajoutée plus tard)
 * 
 * @returns {View} Render de la page `accueil` avec :
 * - trajets : Liste des trajets récupérés par le contrôleur
 * 
 * @errors
 * - 500 : En cas d’échec lors de la récupération des données
 * 
 * @usage
 * - Page d'accueil utilisateur affichant tous les trajets disponibles
 * - Utilise Sequelize en interne pour les jointures et la récupération en base
 */

router.get('/', async (req, res) => {
  try {
    const trajets = await getAllTrajets();
    res.render('accueil', { trajets });
  } catch (err) {
    console.error('❌ Erreur contrôleur trajet :', err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
