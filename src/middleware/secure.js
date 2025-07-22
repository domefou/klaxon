const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const User = require('../models/users'); // modèle Sequelize





/**
 * @function checkJWT
 * @description Middleware Express pour vérifier, décoder et renouveler un jeton JWT.
 *
 * @usage Protège les routes en s'assurant que l'utilisateur est authentifié via un JWT stocké dans les cookies.
 *
 * @workflow
 * 1. Récupère le token depuis les cookies (`req.cookies.token`)
 * 2. Supprime le préfixe 'Bearer ' si présent
 * 3. Vérifie et décode le token avec la clé secrète (SECRET_KEY)
 * 4. Charge l'utilisateur depuis la base via `decoded.user.id_user`
 * 5. Si l'utilisateur est trouvé :
 *    - ajoute `req.user` pour le rendre accessible aux routes suivantes
 *    - renouvelle le token et le remet dans le cookie
 * 6. Sinon : redirection vers la page `/login`
 *
 * @env SECRET_KEY {string} Clé secrète utilisée pour signer et vérifier le token JWT
 *
 * @dependencies
 * - jsonwebtoken : pour gérer les tokens JWT
 * - Sequelize : pour requêter l'utilisateur avec `User.findByPk(...)`
 *
 * @returns {void} Passe au middleware suivant via `next()` ou redirige vers la page de connexion
 */

exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.token;

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log('Token non valide');
                return res.redirect('/login'); // Rediriger vers la page de connexion
            }

            try {
                // 🔍 Charger l'utilisateur depuis la base via l'ID (ou email) stocké dans le token
                const user = await User.findByPk(decoded.user.id_user); // ou decoded.user.mail
                if (!user) return res.status(401).json('user_not_found');

                req.user = user; // 👤 Accessible dans les routes protégées
            } catch (err) {
                console.error('Erreur chargement utilisateur', err);
                return res.redirect('/login'); // Rediriger vers la page de connexion
            }

            // Renouveler le token
            const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, { expiresIn: 24 * 60 * 60 });
            res.cookie('token', 'Bearer ' + newToken, { httpOnly: true, secure: true });

            return next();
        });
    } else {
        console.log('Authentification échouée');
        return res.render('login', {
            title: 'login',
            errorMessage: '*connection requise.'
        });
    }
};
