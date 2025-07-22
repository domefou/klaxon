const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');
const { create: createTrajet } = require('../../../services/trajets');

//ajouter un trajet
/**
 * @module CreateTrajetRoute
 * @description Route d’ajout de nouveaux trajets dans le système, accessible uniquement aux utilisateurs authentifiés via JWT.
 * 
 * @dependencies
 * - express : Framework Node.js pour définir des routes
 * - secure.checkJWT : Middleware d’authentification via jeton JWT
 * - createTrajet : Service métier responsable de la validation et de l’enregistrement du trajet
 * 
 * @route POST /
 * @access Utilsateur authentifié
 * @handler createTrajet : Fonction appelée pour créer un nouveau trajet dans la base
 *
 * @expectedBody
 * - id_user {number} : Identifiant de l’auteur du trajet
 * - id_agence_depart {number} : Identifiant de l’agence de départ
 * - id_agence_arrivee {number} : Identifiant de l’agence d’arrivée
 * - date_depart {string} : Date du départ (format YYYY-MM-DD)
 * - heure_depart {string} : Heure du départ (format HH:MM:SS)
 * - date_arrivee {string} : Date d’arrivée
 * - heure_arrivee {string} : Heure d’arrivée
 * - place {number} : Nombre de places disponibles
 * 
 * @returns {Object} Résultat de l’opération (succès, erreur, redirection, etc.)
 * 
 * @exports {express.Router} : Router prêt à être utilisé dans l'application principale
 */
router.post('/', secure.checkJWT, createTrajet);

module.exports = router;

