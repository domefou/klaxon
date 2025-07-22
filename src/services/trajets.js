const Trajet = require('../models/trajets');
const User = require('../models/users');

// ➕ Créer un trajet

/**
 * @module adminTrajets
 * @description Gère les opérations métier sur les trajets : création, suppression, mise à jour.
 * 
 * @dependencies
 * - Trajet : Modèle Sequelize représentant les trajets
 * - User : Modèle Sequelize représentant les utilisateurs
 */



/**
 * @function createTrajet
 * @description Crée un nouveau trajet après vérification de l'utilisateur et cohérence des dates.
 * 
 * @param {Request} req - Requête Express contenant les champs nécessaires dans `req.body`
 * @param {Response} res - Réponse Express retournée au client
 * 
 * @validations
 * - Vérifie que l’utilisateur `id_user` existe
 * - Vérifie que l'heure d’arrivée est après l’heure de départ
 * 
 * @returns
 * - 201 : trajet créé avec un message de confirmation
 * - 400 : erreur de validation des données
 * - 500 : erreur serveur
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
        // 🔍 Vérifie que l'utilisateur existe
        const user = await User.findByPk(id_user);
        if (!user) {
            return res.status(404).json({
                success: false,
                errorMessage: `Utilisateur introuvable avec l'ID ${id_user}`
            });
        }

        // 🚫 Agences identiques interdites
        if (id_agence_depart === id_agence_arrivee) {
            return res.status(400).json({
                success: false,
                errorMessage: "L’agence de départ ne peut pas être identique à celle d’arrivée."
            });
        }

        const departDateTime = new Date(`${date_depart}T${heure_depart}`);
        const arriveeDateTime = new Date(`${date_arrivee}T${heure_arrivee}`);
        const now = new Date();

        // ⏳ Départ dans le passé interdit
        if (departDateTime <= now) {
            return res.status(400).json({
                success: false,
                errorMessage: "La date et l'heure de départ ne peuvent pas être dans le passé."
            });
        }

        // 🔁 Vérifie que l'arrivée est après le départ
        if (arriveeDateTime <= departDateTime) {
            return res.status(400).json({
                success: false,
                errorMessage: "La date et l'heure d'arrivée doivent être après celles du départ."
            });
        }

        // ✅ Créer le trajet
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
 * @description Supprime un trajet existant à partir de son identifiant.
 * 
 * @param {Request} req - Requête Express contenant `id_trajet` dans `req.body`
 * @param {Response} res - Réponse Express
 * 
 * @returns
 * - 200 : suppression réussie + URL de redirection en fonction de l'auteur du trajet
 * - 400 : ID manquant
 * - 404 : trajet introuvable
 * - 500 : erreur serveur
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
        const trajet = await Trajet.findOne({ where: { id_trajet: id_trajet.trim() } });

        if (!trajet) {
            return res.status(404).json({
                success: false,
                errorMessage: "Trajet introuvable ou déjà supprimé."
            });
        }

        const id_user = trajet.id_user;

        await Trajet.destroy({ where: { id_trajet: id_trajet.trim() } });

        return res.status(200).json({
            success: true,
            successMessage: `Trajet supprimé`,
            redirectUrl: id_user ? `/user/${id_user}` : '/user/menu'
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
 * @description Met à jour les informations d’un trajet existant avec les champs non vides transmis.
 * 
 * @param {Request} req - Requête Express contenant `id_trajet` + champs modifiables
 * @param {Response} res - Réponse Express
 * 
 * @logique
 * - Recherche du trajet
 * - Mise à jour de chaque champ non vide et valide
 * 
 * @returns
 * - 200 : message de succès
 * - 400 : ID manquant
 * - 404 : trajet introuvable
 * - 500 : erreur serveur
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

        // 🔁 Validation : agences différentes
        if (trajet.id_agence_depart === trajet.id_agence_arrivee) {
            return res.status(400).json({
                success: false,
                errorMessage: "L’agence de départ ne peut pas être identique à celle d’arrivée."
            });
        }

        // ⏳ Validation : date de départ dans le futur
        const departDateTime = new Date(`${trajet.date_depart}T${trajet.heure_depart}`);
        const now = new Date();

        if (departDateTime <= now) {
            return res.status(400).json({
                success: false,
                errorMessage: "La date et l'heure de départ ne peuvent pas être dans le passé."
            });
        }

        await trajet.save();

        return res.status(200).json({
            success: true,
            successMessage: "Trajet mis à jour"
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
