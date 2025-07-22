const Trajet = require('../models/trajets');
const User = require('../models/users');
const Agence = require('../models/agence');

/**
 * @module adminAgences
 * @description Regroupe les opérations CRUD liées aux agences (ajout, modification, suppression).
 *
 * @dependencies
 * - Trajet : Modèle Sequelize lié aux trajets
 * - User : Modèle Sequelize représentant les utilisateurs
 * - Agence : Modèle Sequelize représentant les agences
 */




/**
 * @function createAgence
 * @description Crée une nouvelle agence à partir du champ `agence` présent dans le corps de la requête.
 * 
 * @param {Request} req - Requête Express contenant `agence` dans `req.body`
 * @param {Response} res - Réponse Express
 * 
 * @returns {201 Created} avec un message et l’ID de l’agence créée
 * @throws {400 Bad Request} si le champ est vide ou absent
 * @throws {500 Internal Server Error} en cas d’échec serveur
 */

async function createAgence(req, res) {
    const { agence } = req.body;

    if (!agence || agence.trim() === '') {
        return res.status(400).json({
            success: false,
            errorMessage: "Le nom d'agence est requis."
        });
    }

    try {
        const newAgence = await Agence.create({ agence: agence.trim() });

        return res.status(201).json({
            success: true,
            successMessage: `Agence ajoutée : ${newAgence.agence}`,
            id_agence: newAgence.id_agence
        });
    } catch (err) {
        console.error("❌ Erreur création agence :", err.message || err);

        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la création."
        });
    }
}




//
/**
 * @function updateAgence
 * @description Met à jour le nom d'une agence existante en base.
 *
 * @param {Request} req - Requête Express contenant `id_agence` et `agence` dans `req.body`
 * @param {Response} res - Réponse Express
 * 
 * @returns {200 OK} avec un message de confirmation
 * @throws {400 Bad Request} si les données sont invalides
 * @throws {404 Not Found} si l’agence n’existe pas
 * @throws {500 Internal Server Error} si une erreur survient lors de la sauvegarde
 */

async function updateAgence(req, res) {
    const { id_agence, agence } = req.body;

    if (!id_agence || !agence || agence.trim() === '') {
        return res.status(400).json({
            success: false,
            errorMessage: "Données invalides."
        });
    }

    try {
        const agenceRecord = await Agence.findByPk(id_agence);
        if (!agenceRecord) {
            return res.status(404).json({
                success: false,
                errorMessage: "Agence introuvable."
            });
        }

        agenceRecord.agence = agence.trim();
        await agenceRecord.save();

        return res.status(200).json({
            success: true,
            successMessage: `Agence mise à jour : ${agenceRecord.agence}`
        });
    } catch (err) {
        console.error("❌ Erreur modification agence :", err.message || err);

        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la modification."
        });
    }
}



/**
 * @function deleteAgence
 * @description Supprime une agence via son identifiant.
 * 
 * @param {Request} req - Requête Express contenant `id_agence` dans `req.body`
 * @param {Response} res - Réponse Express
 * 
 * @returns {200 OK} avec message de suppression
 * @throws {400 Bad Request} si l’ID est manquant ou vide
 * @throws {404 Not Found} si aucune agence n’est trouvée
 * @throws {500 Internal Server Error} si une erreur serveur survient
 */

async function deleteAgence(req, res) {
    const { id_agence } = req.body;

    if (!id_agence || id_agence.trim() === '') {
        return res.status(400).json({
            success: false,
            errorMessage: "ID d'agence manquant."
        });
    }

    try {
        const deleted = await Agence.destroy({ where: { id_agence: id_agence.trim() } });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                errorMessage: "Agence introuvable ou déjà supprimée."
            });
        }

        return res.status(200).json({
            success: true,
            successMessage: `Agence supprimée`
        });
    } catch (err) {
        console.error("❌ Erreur suppression agence :", err.message || err);

        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la suppression."
        });
    }
}




module.exports = {
    create: createAgence,
    delete: deleteAgence,
    update: updateAgence
};

