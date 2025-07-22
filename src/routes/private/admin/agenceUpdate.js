const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');

const { update: updateAgence } = require('../../../services/adminAgences');

/**
 * @module UpdateAgenceRoute
 * @description Gère la mise à jour d'une agence via une requête HTTP POST, protégée par le middleware JWT.
 * 
 * @dependencies
 * - express : Framework serveur pour créer des routes
 * - secure.checkJWT : Middleware qui vérifie le jeton d’authentification
 * - updateAgence : Fonction métier qui applique les modifications d’une agence en base de données
 * 
 * @route POST /
 * @access Admin authentifié (JWT requis)
 * @handler updateAgence : Traite la mise à jour d’une agence existante
 * 
 * @usage
 * - Reçoit généralement un `id_agence` + un nouveau champ `agence` dans `req.body`
 * - Utilisé depuis une interface de gestion ou formulaire d’administration
 * - Le service `updateAgence` doit valider l’entrée, rechercher l’agence et appliquer les changements
 * 
 * @exports {express.Router} : Router Express à monter dans l’application principale
 */

router.post('/', secure.checkJWT, updateAgence);



module.exports = router;