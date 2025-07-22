const express = require('express');
const router = express.Router();

//deconnect
/**
 * @module LogoutRoute
 * @description Gère la déconnexion de l’utilisateur en supprimant le cookie contenant le jeton JWT.
 * 
 * @dependencies
 * - express : Framework Node.js utilisé pour créer la route
 * 
 * @route GET /
 * @access Public (peut être déclenchée sans authentification préalable)
 * 
 * @workflow
 * 1. Supprime le cookie nommé `token` qui contient le jeton JWT (via `res.clearCookie`)
 * 2. Redirige immédiatement vers la page `/login` pour afficher le formulaire de connexion
 * 
 * @returns {Redirect} Redirection vers `/login` après suppression du cookie
 * 
 * @usage
 * - Utilisé pour déconnecter manuellement un utilisateur depuis un bouton ou un lien "Déconnexion"
 * - Permet de réinitialiser la session sans invalider le token côté serveur (jetons JWT étant stateless)
 *
 * @note Tu peux renforcer la sécurité en ajoutant des headers ou en purgeant davantage la session si nécessaire.
 */

router.get('/', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.redirect('/login'); // Redirige vers la page de connexion
});

module.exports = router; 