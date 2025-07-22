const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');
const { update } = require('../../../services/trajets');

/**
 * @module UpdateTrajetRoute
 * @description Gère la mise à jour des informations d’un trajet existant via une requête HTTP POST, protégée par jeton JWT.
 * 
 * @dependencies
 * - express : Framework serveur pour gérer les routes
 * - secure.checkJWT : Middleware d’authentification par jeton
 * - updateTrajet : Service métier contenant la logique de mise à jour en base
 * 
 * @route POST /
 * @access Utilisateur authentifié
 * @handler updateTrajet : Fonction appelée pour modifier un trajet
 * 
 * @expectedBody
 * - id_trajet {number} : Identifiant du trajet à modifier
 * - id_user {number} : (optionnel) Nouvel auteur du trajet
 * - id_agence_depart {number}
 * - id_agence_arrivee {number}
 * - date_depart {string} : Format YYYY-MM-DD
 * - heure_depart {string} : Format HH:MM:SS
 * - date_arrivee {string}
 * - heure_arrivee {string}
 * - place {number}
 * 
 * @returns {Object} Réponse avec message de succès ou d’erreur
 * 
 * @usage
 * - Utilisé depuis une interface admin pour éditer un trajet existant
 * - Le service `updateTrajet` devrait effectuer des validations : intégrité, cohérence horaire, etc.
 */

router.post('/', secure.checkJWT, update);

module.exports = router;
