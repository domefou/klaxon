const Trajet = require('../models/trajets');
const User = require('../models/users');

/**
 * @module adminTrajets
 * @description Contient les fonctions métier pour gérer les trajets (création, suppression, modification).
 * 
 * @dependencies
 * - Trajet : Modèle Sequelize représentant les trajets
 * - User : Modèle Sequelize représentant les utilisateurs (nécessaire pour valider l’auteur du trajet)
 */



/**
 * @function createTrajet
 * @description Crée un nouveau trajet en base après validation des données.
 *
 * @param {Request} req - Objet Express contenant les champs du formulaire
 * @param {Response} res - Objet Express utilisé pour répondre à la requête
 * 
 * @validations
 * - Vérifie que l’utilisateur existe (`User.findByPk`)
 * - Vérifie que la date/heure d’arrivée est après celle du départ
 *
 * @expectedBody
 * - id_user, id_agence_depart, id_agence_arrivee
 * - date_depart, heure_depart
 * - date_arrivee, heure_arrivee
 * - place
 *
 * @returns {201 Created} avec l’ID du trajet et un message de succès
 * @throws {400 Bad Request} si utilisateur introuvable ou incohérence temporelle
 * @throws {500 Internal Server Error} en cas d’échec serveur
 */

async function createTrajet(req, res) {
    const {
        id_user,
        id_agence_depart,
        date_arrivee,
        heure_arrivee,
        date_depart,
        heure_depart,
        id_agence_arrivee,
        place
    } = req.body;

    try {
        const user = await User.findByPk(id_user);
        if (!user) {
            return res.status(404).json({
                success: false,
                errorMessage: `Utilisateur introuvable avec l'ID ${id_user}`
            });
        }

        const departDateTime = new Date(`${date_depart}T${heure_depart}`);
        const arriveeDateTime = new Date(`${date_arrivee}T${heure_arrivee}`);

        if (arriveeDateTime <= departDateTime) {
            return res.status(400).json({
                success: false,
                errorMessage: `La date et l'heure d'arrivée doivent être après celles du départ.`
            });
        }

        const newTrajet = await Trajet.create({
            id_user,
            date_depart,
            heure_depart,
            date_arrivee,
            heure_arrivee,
            id_agence_depart,
            id_agence_arrivee,
            place
        });

        const formattedStart = departDateTime.toLocaleDateString('fr-FR');
        const formattedEnd = arriveeDateTime.toLocaleDateString('fr-FR');

        return res.status(201).json({
            success: true,
            successMessage: `Trajet créé avec succès du ${formattedStart} au ${formattedEnd}.`,
            id_trajet: newTrajet.id_trajet
        });
    } catch (error) {
        console.error("❌ Erreur création trajet :", error.message || error);
        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la création du trajet."
        });
    }
}



// 🗑️ Supprimer un trajet

/**
 * @function deleteTrajet
 * @description Supprime un trajet existant selon son identifiant.
 * 
 * @param {Request} req - Objet Express contenant `id_trajet` dans `req.body`
 * @param {Response} res - Objet Express
 * 
 * @returns {200 OK} si suppression réussie
 * @throws {400 Bad Request} si l’ID est vide ou manquant
 * @throws {404 Not Found} si aucun trajet ne correspond
 * @throws {500 Internal Server Error} si une erreur survient en base
 */

async function deleteTrajet(req, res) {
    const { id_trajet } = req.body;

    if (!id_trajet || id_trajet.trim() === '') {
        return res.status(400).json({
            success: false,
            errorMessage: "ID du trajet manquant."
        });
    }

    try {
        const deleted = await Trajet.destroy({ where: { id_trajet: id_trajet.trim() } });

        if (deleted) {
            return res.status(200).json({
                success: true,
                successMessage: `Trajet supprimé`
            });

        }
        return res.status(404).json({
            success: false,
            errorMessage: "Trajet introuvable ou déjà supprimé."
        });
    } catch (err) {
        console.error("❌ Suppression trajet :", err.message || err);
        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la suppression."
        });
    }
}


// ✏️ Mettre à jour un trajet

/**
 * @function updateTrajet
 * @description Met à jour les champs renseignés d’un trajet existant.
 * 
 * @param {Request} req - Objet Express contenant `id_trajet` et les champs à modifier dans `req.body`
 * @param {Response} res - Objet Express
 * 
 * @logic
 * - Vérifie l'existence du trajet en base
 * - Applique toutes les modifications non vides sauf l’identifiant
 * 
 * @returns {200 OK} avec un message de mise à jour
 * @throws {400 Bad Request} si `id_trajet` est manquant
 * @throws {404 Not Found} si aucun trajet ne correspond à l’ID
 * @throws {500 Internal Server Error} en cas d’échec serveur
 */

async function updateTrajet(req, res) {
    const id = req.body.id_trajet?.trim();
    const newData = req.body;

    if (!id || id === '') {
        return res.status(400).json({
            success: false,
            errorMessage: "ID du trajet manquant."
        });
    }

    try {
        const trajet = await Trajet.findOne({ where: { id_trajet: id } });
        if (!trajet) {
            return res.status(404).json({
                success: false,
                errorMessage: "Trajet introuvable."
            });
        }

        Object.keys(newData).forEach(key => {
            if (
                key !== 'id_trajet' &&
                newData[key] !== undefined &&
                newData[key].trim() !== ''
            ) {
                trajet[key] = newData[key].trim();
            }
        });

        await trajet.save();

        return res.status(200).json({
            success: true,
            successMessage: `Trajet mis à jour`
        });
    } catch (error) {
        console.error("❌ Update trajet :", error.message || error);
        return res.status(500).json({
            success: false,
            errorMessage: "Erreur serveur lors de la mise à jour."
        });
    }
}


module.exports = {
    create: createTrajet,
    delete: deleteTrajet,
    update: updateTrajet
};
