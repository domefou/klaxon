const express = require('express');
const router = express.Router();
const { authenticate } = require("../../services/users");


/**
 * @module LoginRoute
 * @description Gère le rendu de la page de connexion et la soumission du formulaire d'authentification.
 * 
 * @dependencies
 * - express : Framework serveur Node.js
 * - authenticate : Fonction métier responsable de l'identification de l'utilisateur
 * 
 * @route GET /
 * @description Affiche la page de connexion. Si un cookie JWT est présent, il est supprimé.
 * 
 * @workflow (GET)
 * 1. Vérifie la présence d’un cookie nommé `token` (jeton JWT)
 * 2. Supprime ce cookie si présent, pour éviter les connexions persistantes involontaires
 * 3. Récupère un éventuel `successMessage` de session et le purge
 * 4. Rend la vue `login` avec les messages associés
 * 
 * @route POST /
 * @handler authenticate : Fonction chargée de traiter la soumission du formulaire et de connecter l’utilisateur
 * 
 * @expectedBody
 * - mail {string} : Adresse e-mail de l’utilisateur
 * - password {string} : Mot de passe en clair à comparer au hash en base
 * 
 * @returns {Redirect|View} : Redirection vers le tableau de bord ou affichage d’un message d’erreur
 * 
 * @exports {express.Router} : Router Express à monter dans l’application principale
 */

router.get('/', async (req, res) => {
    if (req.cookies.token) {
        // Vérifiez si un jeton JWT est présent
        console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
        res.clearCookie('token'); // Supprimez le jeton JWT
        console.log('Jeton supprimé.'); // Ajout de journaux
    }
    const successMessage = req.session.successMessage;
    req.session.successMessage = null;
    res.render('login', {
        title: 'login',
        successMessage,
        errorMessage: null
    });
});




router.post('/', authenticate);



module.exports = router;