const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Trajet = require('../models/trajets');
const bcrypt = require('bcryptjs');


const { SECRET_KEY } = process.env;

/**
 * @module usersService
 * @description Contient les fonctions métier pour l'authentification des utilisateurs et l'initialisation de leur mot de passe.
 *
 * @dependencies
 * - express : Framework serveur
 * - bcryptjs : Pour le hachage et la comparaison de mot de passe
 * - jwt : Pour générer des jetons d’authentification (JWT)
 * - User : Modèle Sequelize représentant les utilisateurs
 * - Trajet : (non utilisé ici mais importé)
 * - process.env.SECRET_KEY : Clé secrète utilisée pour signer les JWT
 */




/**
 * @function authenticate
 * @description Authentifie un utilisateur selon son adresse email et mot de passe. Génère un JWT si les identifiants sont valides.
 *
 * @param {Request} req - Requête Express contenant `mail` et `password` dans `req.body`
 * @param {Response} res - Réponse Express utilisée pour rendre la vue ou rediriger
 *
 * @logic
 * - Vérifie que le mot de passe a une longueur minimale
 * - Recherche l’utilisateur via son email
 * - Vérifie que le mot de passe existe (sinon propose d’en initier un)
 * - Compare le mot de passe saisi avec celui stocké en base
 * - En cas de succès : génère un JWT, le stocke dans un cookie sécurisé et redirige selon le rôle (`admin` ou `user`)
 *
 * @returns
 * - Redirection vers `/admin/menu` ou `/user/menu`
 * - Vue `login` avec message d’erreur si échec
 * - 500 en cas d’erreur serveur
 */

async function authenticate(req, res) {
    const { mail, password } = req.body;

    if (!password || password.length < 8) {
        return res.render('login', {
            title: 'login',
            successMessage: null,
            errorMessage: "Le mot de passe doit contenir au moins 8 caractères'"
        });

    }

    try {
        const user = await User.findOne({ where: { mail: mail } });

        if (!user) {
            return res.render('login', {
                title: 'login',
                successMessage: null,
                errorMessage: "Adresse email incorrecte."
            });

        }

        if (!user.password) {
            return res.render('login', {
                title: 'login',
                successMessage: null,
                errorMessage: "Ce compte n'a pas encore de mot de passe. Veuillez en définir un."
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                title: 'login',
                successMessage: null,
                errorMessage: "Mot de passe incorrect."
            });
        }

        const { id_user, nom, prenom, mail: userMail, role } = user;
        const token = jwt.sign({ user: { id_user, nom, prenom, mail: userMail, role } }, SECRET_KEY, {
            expiresIn: 24 * 60 * 60
        });

        res.cookie('token', 'Bearer ' + token, { httpOnly: true, secure: true });

        return res.redirect(role === 'admin' ? '/admin/menu' : '/user/menu');

    } catch (error) {
        console.error('Erreur authenticate :', error);
        return res.status(500).json({ message: "Erreur du serveur interne", erreur: error });
    }
};



/**
 * @function initPassword
 * @description Initialise le mot de passe d’un utilisateur s’il n’en possède pas encore.
 *
 * @param {Request} req - Requête Express contenant `mail`, `nom` et `password` dans `req.body`
 * @param {Response} res - Réponse Express pour rendre la vue ou rediriger
 *
 * @logic
 * - Vérifie que le mot de passe est valide (au moins 8 caractères)
 * - Recherche l’utilisateur via son nom et email
 * - Vérifie qu’il n’a pas déjà de mot de passe défini
 * - Hash le mot de passe avec bcrypt et le sauvegarde
 * - Définit un message de succès dans la session puis redirige vers `/login`
 *
 * @returns
 * - Vue `initPassword` avec message d’erreur
 * - Redirection vers `/login` avec message de succès
 * - Vue `login` si le mot de passe est déjà défini
 * - 500 en cas d’erreur serveur
 */

async function initPassword(req, res) {
    const { mail, nom, password } = req.body;

    console.log('📩 Données reçues :', { mail, nom, password });

    try {
        if (!password || password.length < 8) {
            console.log('❌ Mot de passe trop court');
            return res.render('initPassword', {
                errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        const user = await User.findOne({ where: { mail: mail, nom: nom } });
        console.log('🔍 Utilisateur trouvé :', user ? user.dataValues : 'Aucun');

        if (!user) {
            console.log('❌ Aucun utilisateur trouvé avec ce nom et mail');
            return res.render('initPassword', {
                errorMessage: "Adresse email ou nom incorrect."
            });
        }

        if (user.password) {
            console.log('⚠️ Mot de passe déjà défini pour cet utilisateur');
            return res.render('login', {
                errorMessage: "Ce compte a déjà un mot de passe défini."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        console.log('✅ Mot de passe défini avec succès pour', user.mail);

        // ✅ Message de succès via session
        req.session.successMessage = `Mot de passe mis à jour.`;
        return res.redirect("/login");

    } catch (error) {
        console.error("💥 Erreur initPassword :", error.message || error);
        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message || 'Erreur inconnue'
        });
    }
};


module.exports = {
    authenticate,
    initPassword
};