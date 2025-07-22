const sequelize = require('../config/sequelize');

/**
 * @script initDatabase
 * @description Script d'initialisation de la connexion à la base MySQL et de synchronisation des modèles Sequelize.
 *
 * @dependencies
 * - sequelize : Instance Sequelize connectée à la base via ton fichier `config/sequelize.js`
 *
 * @workflow
 * 1. Tente d’authentifier la connexion avec la base MySQL (`sequelize.authenticate`)
 * 2. Si réussite, synchronise les modèles Sequelize avec la base (`sequelize.sync`)
 *    - `force: false` signifie : ne pas recréer les tables si elles existent déjà
 *
 * @logs
 * - ✅ Connexion réussie
 * - 📦 Synchronisation des modèles
 * - ❌ Log d’erreur en cas d’échec
 *
 * @usage
 * - Peut être exécuté manuellement ou intégré dans un processus de déploiement/init (ex : `npm run init-db`)
 */

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à MySQL réussie !');

        await sequelize.sync({ force: false });
        console.log('📦 Base synchronisée avec Sequelize');
    } catch (err) {
        console.error('❌ Erreur de connexion/synchronisation :', err.message);
    }
})();