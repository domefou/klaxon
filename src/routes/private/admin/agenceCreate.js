const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');

const { create: createAgence } = require('../../../services/adminAgences');


/**
 * @module AgenceRoutes
 * @description Gère la création d'une agence via une requête HTTP POST, protégée par un middleware d'authentification JWT.
 * 
 * @dependencies
 * - express : Framework serveur Node.js
 * - secure.checkJWT : Middleware vérifiant le jeton JWT pour protéger l'accès
 * - createAgence : Service métier qui gère l'ajout d'une agence en base
 * 
 * @route POST /
 * @access Authentifié (JWT requis)
 * @handler createAgence : Fonction appelée pour insérer une nouvelle agence
 * 
 * @usage
 * - Utilisé dans le panneau d'administration pour créer une nouvelle agence via un formulaire ou une requête JSON
 * - Attend généralement un champ `agence` dans le corps de la requête
 * 
 * @exports {express.Router} : Router Express prêt à être monté dans l'application principale
 */

router.post('/', secure.checkJWT, createAgence);


module.exports = router;