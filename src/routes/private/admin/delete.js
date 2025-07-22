const express = require('express');
const router = express.Router();
const secure = require('../../../middleware/secure');
const { delete: deleteTrajet } = require('../../../services/adminTrajets');


/**
 * @module DeleteTrajetRoute
 * @description Route Express permettant la suppression d’un trajet via une requête HTTP DELETE, sécurisée par JWT.
 * 
 * @dependencies
 * - express : Framework Node.js pour créer des routes
 * - secure.checkJWT : Middleware de contrôle d’accès via jeton JWT
 * - deleteTrajet : Fonction métier chargée de supprimer un trajet en base
 * 
 * @route DELETE /
 * @access Administrateur authentifié
 * @handler deleteTrajet : Logique de suppression exécutée côté service
 * 
 * @expectedBody
 * - id_trajet {number} : Identifiant du trajet à supprimer (reçu dans le corps de la requête ou dans les paramètres selon le design de ton API)
 * 
 * @returns {Object} Réponse standard (succès, erreur, message ou redirection)
 * 
 * @usage
 * - Utilisé depuis une interface admin ou via appel API REST
 * - Peut inclure vérification de l'existence du trajet et gestion des erreurs SQL (intégrité référentielle par exemple)
 * 
 * @exports {express.Router} : Router prêt à être intégré dans l’application principale
 */

router.delete('/', secure.checkJWT, deleteTrajet);





module.exports = router;