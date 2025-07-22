const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');

const { delete: deleteAgence } = require('../../../services/adminAgences');

/**
 * @module DeleteAgenceRoute
 * @description Gère la suppression d'une agence via une requête HTTP POST, protégée par JWT.
 * 
 * @dependencies
 * - express : Framework Node.js pour créer des routes
 * - secure.checkJWT : Middleware d’authentification par jeton JWT
 * - deleteAgence : Service métier chargé de supprimer une agence en base
 * 
 * @route POST /
 * @access Authentifié (JWT requis)
 * @handler deleteAgence : Fonction appelée pour exécuter la suppression
 * 
 * @usage
 * - Utilisé dans l’interface d’administration
 * - Attente typique : un champ `id_agence` dans le corps de la requête
 * - Le service doit gérer les cas d’usage : agence non trouvée, erreurs SQL, dépendances (ex: trajets liés)
 * 
 * @exports {express.Router} : Router prêt à être intégré dans l’app principale
 */

router.post('/', secure.checkJWT, deleteAgence);


module.exports = router;