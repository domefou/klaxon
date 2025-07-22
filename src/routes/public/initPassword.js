const express = require('express');
const router = express.Router();
const { initPassword } = require("../../services/users");

/**
 * @module InitPasswordRoute
 * @description Gère la réinitialisation ou l’initialisation du mot de passe d’un utilisateur via une interface dédiée.
 * 
 * @dependencies
 * - express : Framework serveur Node.js
 * - initPassword : Fonction du service utilisateur qui traite la logique d’initiation du mot de passe
 * 
 * @route GET /
 * @description Affiche le formulaire d’initialisation du mot de passe. Si un jeton JWT est présent dans les cookies, il est supprimé.
 * 
 * @workflow (GET)
 * 1. Vérifie la présence d'un jeton JWT dans les cookies
 * 2. Supprime le cookie 'token' si présent (pour éviter conflits ou accès non sécurisé)
 * 3. Rend la vue `initPassword` avec `title` et message d’erreur null
 * 
 * @route POST /
 * @handler initPassword : Fonction métier qui traite la soumission du formulaire et met à jour le mot de passe
 * 
 * @expectedBody
 * - mail {string} : Adresse e-mail de l'utilisateur
 * - nouveauPassword {string} : Nouveau mot de passe à définir
 * 
 * @returns {View|Redirect} Vue avec message de succès/erreur ou redirection selon le flux logique
 * 
 * @exports {express.Router} : Router prêt à être utilisé par l'application principale
 */

router.get('/', async (req, res) => {
    if (req.cookies.token) {
        // Vérifiez si un jeton JWT est présent
        console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
        res.clearCookie('token'); // Supprimez le jeton JWT
        console.log('Jeton supprimé.'); // Ajout de journaux
    }
    res.render('initPassword', {
        title: 'initPassword',
        errorMessage: null
    });
});



router.post('/', initPassword);


module.exports = router;