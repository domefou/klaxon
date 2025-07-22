/**
 * @module userMenuJS
 * @description Gère les interactions utilisateur côté frontend : formulaire de trajet, modale d’informations, validation et communication avec les routes backend.
 *
 * @features
 * 🔒 Déconnexion
 * - Redirection vers `/logout` depuis un bouton

 * 🧾 Création / Mise à jour de trajet
 * - Préremplit le formulaire si `id_trajet` existe
 * - Valide les champs avant envoi : agences sélectionnées, date départ dans le futur, arrivée après départ
 * - Envoie les données vers `/user/menu/create` ou `/user/menu/update` selon le contexte

 * 🗑️ Suppression de trajet
 * - Récupère l’ID du trajet via `data-idtrajet`
 * - Envoie une requête DELETE vers `/user/menu/delete`
 * - Affiche un message et redirige vers `/user/menu` après traitement

 * 📖 Affichage d’informations utilisateur dans une modale
 * - Récupère les données via `/admin/menu/modale/:idUser`
 * - Affiche nom, téléphone, mail et nombre de places dans une modale
 * - Gère l’ouverture/fermeture via bouton ou clic extérieur

 * 🧠 Utilitaires
 * - `showMessage(text, type)` : Affiche une alerte temporaire (succès / erreur)
 * - Scroll automatique vers le haut et vers le formulaire
 *
 * @notes
 * - Les interactions sont fluides grâce aux redirections différées
 * - Le formulaire détecte automatiquement le mode "création" ou "mise à jour"
 * - Les erreurs réseau ou de validation sont gérées avec clarté
 */

document.addEventListener('DOMContentLoaded', () => {

    function showMessage(text, type = 'success') {
        const box = document.getElementById('messageBox');
        if (!box) return;

        box.textContent = text;
        box.className = `alert ${type}`;
        box.style.display = 'block';

        setTimeout(() => {
            box.style.display = 'none';
        }, 4000);
    }






    // 🔒 Déconnexion
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }

    const form = document.getElementById('formCreate');
    const idTrajetInput = document.getElementById('id_trajet');
    const btnSubmit = document.getElementById('btn_submit');
    const paramsMessage = document.querySelector('.paramsMessage');

    // 🧭 Détermine si on met à jour ou on crée
    const isEdition = idTrajetInput && idTrajetInput.value.trim() !== '';
    btnSubmit.textContent = isEdition ? 'Mettre à jour' : 'Envoyer';

    // 🎯 Toggle formulaire
    const newTrajetBtn = document.getElementById('newTrajet');
    if (newTrajetBtn && form) {
        newTrajetBtn.addEventListener('click', () => {
            const visible = form.style.display === 'block';
            form.style.display = visible ? 'none' : 'block';
            newTrajetBtn.textContent = visible ? 'Créer un trajet' : 'Fermer le formulaire';
            if (!visible) form.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 🖋️ Modifier trajet
    document.querySelectorAll('.btn_user.edit').forEach(button => {
        button.addEventListener('click', () => {
            const cells = button.closest('tr').children;
            form.action = '/user/menu/update';
            btnSubmit.textContent = 'Mettre à jour';

            document.getElementById('date_depart').value = cells[1].textContent.trim();
            document.getElementById('heure_depart').value = cells[2].textContent.trim();
            document.getElementById('date_arrivee').value = cells[4].textContent.trim();
            document.getElementById('heure_arrivee').value = cells[5].textContent.trim();
            document.getElementById('place').value = cells[6].textContent.trim();
            document.getElementById('id_user').value = cells[7].textContent.trim();
            document.getElementById('id_trajet').value = cells[8].textContent.trim();
            document.getElementById('id_agence_depart').value = cells[9].textContent.trim();
            document.getElementById('id_agence_arrivee').value = cells[10].textContent.trim();

            form.style.display = 'block';
            newTrajetBtn.textContent = 'Fermer le formulaire';
            form.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 🗑️ Supprimer un trajet
    document.querySelectorAll('.inputDelete').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('id_trajet').value = button.dataset.idtrajet;
            document.getElementById('globalDeleteForm').dispatchEvent(new Event('submit'));
        });
    });

    document.querySelectorAll('.inputDelete').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.idtrajet?.trim();
            if (!id) return;

            try {
                const response = await fetch('/user/menu/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_trajet: id })
                });

                const result = await response.json();

                if (result.success && result.successMessage) {
                    showMessage(result.successMessage, 'success');
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    setTimeout(() => {
                        window.location.href = '/user/menu';
                    }, 3000);
                } else if (!result.success && result.errorMessage) {
                    showMessage(result.errorMessage, 'error');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }

            } catch (error) {
                console.error("❌ Suppression échouée :", error.message || error);
                showMessage("Erreur réseau ou serveur inattendue.", 'error');
            }
        });
    });


    // ✅ Soumission de création ou mise à jour via fetch
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const depart = document.getElementById('id_agence_depart').value;
        const arrivee = document.getElementById('id_agence_arrivee').value;
        const dateDep = document.getElementById('date_depart').value;
        const heureDep = document.getElementById('heure_depart').value;
        const dateArr = document.getElementById('date_arrivee').value;
        const heureArr = document.getElementById('heure_arrivee').value;

        const departDateTime = new Date(`${dateDep}T${heureDep}`);
        const arriveeDateTime = new Date(`${dateArr}T${heureArr}`);
        const now = new Date();

        const messages = [];
        if (!depart || !arrivee) messages.push("Sélectionnez les agences de départ et d'arrivée.");
        if (departDateTime <= now) messages.push("La date de départ doit être dans le futur.");
        if (arriveeDateTime <= departDateTime) messages.push("La date d'arrivée doit être après la date de départ.");

        if (messages.length > 0) {
            paramsMessage.innerHTML = messages.map(msg => `<p style="color:red;">${msg}</p>`).join('');
            return;
        }

        const data = {
            id_trajet: document.getElementById('id_trajet').value,
            id_user: document.getElementById('id_user').value,
            id_agence_depart: depart,
            date_depart: dateDep,
            heure_depart: heureDep,
            date_arrivee: dateArr,
            heure_arrivee: heureArr,
            id_agence_arrivee: arrivee,
            place: document.getElementById('place').value
        };

        const isUpdate = form.action.includes('/update');
        const endpoint = isUpdate ? '/user/menu/update' : '/user/menu/create';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success && result.successMessage) {
                showMessage(result.successMessage, 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // ✅ Redirection différée
                setTimeout(() => {
                    window.location.href = '/user/menu';
                }, 3000);
            } else if (!result.success && result.errorMessage) {
                showMessage(result.errorMessage, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    window.location.href = '/user/menu';
                }, 3000);
            }

        } catch (error) {
            console.error("💥 Erreur soumission :", error.message || error);
        }
    });



    // 📖 Affichage des informations utilisateur dans une modale
    document.querySelectorAll('.btn_user.view').forEach(button => {
        button.addEventListener('click', async () => {
            const row = button.closest('tr');
            const idUser = row.children[7].textContent.trim();
            const places = row.children[6].textContent.trim();

            try {
                const response = await fetch(`/admin/menu/modale/${idUser}`);
                if (!response.ok) throw new Error("Utilisateur introuvable");

                const user = await response.json();

                // Remplir la modale
                document.getElementById('modalNom').textContent = user.nom;
                document.getElementById('modalPlace').textContent = places;

                const telEl = document.getElementById('modalTel');
                telEl.textContent = user.telephone;
                telEl.href = `tel:${user.telephone}`;

                const emailEl = document.getElementById('modalEmail');
                emailEl.textContent = user.mail;
                emailEl.href = `mailto:${user.mail}`;


                // Afficher la modale
                document.getElementById('modalTrajet').style.display = 'block';
            } catch (err) {
                console.error("❌ Erreur récupération utilisateur :", err);
            }
        });
    });

    // Fermer la modale
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('modalTrajet').style.display = 'none';
        });
    });

    // Fermer la modale en cliquant à l'extérieur
    document.getElementById('modalTrajet').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.style.display = 'none';
        }
    });





});
