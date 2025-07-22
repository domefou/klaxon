/**
 * @module adminMenuJS
 * @description Script client gérant la logique d'interaction côté admin : affichage du formulaire, validation, création/mise à jour/suppression de trajets.
 *
 * @workflow global
 * 1. ✅ Détection du DOM chargé (`DOMContentLoaded`)
 * 2. 🔒 Gestion du bouton de déconnexion
 * 3. 📤 Initialisation du formulaire (création ou mise à jour d’un trajet)
 * 4. ✏️ Pré-remplissage du formulaire depuis un trajet existant
 * 5. 🧼 Validation des données avant envoi (via `submit`)
 * 6. 🎯 Envoi du formulaire via fetch (create / update)
 * 7. 🗑️ Suppression de trajet via bouton + fetch
 *
 * @functions
 * - showMessage(text, type) : Affiche un message temporaire (alerte succès ou erreur)
 * - Gestion du formulaire de création : bascule visibilité + préremplissage
 * - Validation des champs : date future, arrivée > départ, agences sélectionnées
 *
 * @endpoints utilisés
 * - POST `/admin/menu/create`
 * - POST `/admin/menu/update`
 * - DELETE `/admin/menu/delete`
 *
 * @notes
 * - Les messages s’affichent dans `#messageBox` puis disparaissent automatiquement
 * - La redirection post-action se fait vers `/admin/menu` avec un délai de 3 secondes
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

    // 📤 Formulaire de création/mise à jour de trajet
    const formTrajet = document.getElementById('formCreate');
    const btnSubmit = document.getElementById('btn_submit');
    const idTrajetInput = document.getElementById('id_trajet');

    if (idTrajetInput && idTrajetInput.value.trim() !== '') {
        btnSubmit.textContent = 'Mettre à jour';
    } else {
        btnSubmit.textContent = 'Envoyer';
    }

    // 🎯 Bouton afficher/cacher le formulaire
    const newTrajetBtn = document.getElementById('newTrajet');
    if (newTrajetBtn && formTrajet) {
        newTrajetBtn.addEventListener('click', () => {
            const visible = formTrajet.style.display === 'block';
            formTrajet.style.display = visible ? 'none' : 'block';
            newTrajetBtn.textContent = visible ? 'Créer un trajet' : 'Fermer le formulaire';
            if (!visible) formTrajet.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ✏️ Remplir le formulaire à partir d’un trajet existant
    document.querySelectorAll('.btn_user.edit').forEach(button => {
        button.addEventListener('click', () => {
            const cells = button.closest('tr').children;
            document.getElementById('date_depart').value = cells[1].textContent.trim();
            document.getElementById('heure_depart').value = cells[2].textContent.trim();
            document.getElementById('date_arrivee').value = cells[4].textContent.trim();
            document.getElementById('heure_arrivee').value = cells[5].textContent.trim();
            document.getElementById('place').value = cells[6].textContent.trim();
            document.getElementById('id_user').value = cells[7].textContent.trim();
            document.getElementById('id_trajet').value = cells[8].textContent.trim();
            document.getElementById('id_agence_depart').value = cells[9].textContent.trim();
            document.getElementById('id_agence_arrivee').value = cells[10].textContent.trim();

            btnSubmit.textContent = 'Mettre à jour';
            formTrajet.style.display = 'block';
            newTrajetBtn.textContent = 'Fermer le formulaire';
            formTrajet.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 🧼 Validation avant envoi
    formTrajet.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messages = [];

        const depart = document.getElementById('id_agence_depart').value;
        const arrivee = document.getElementById('id_agence_arrivee').value;

        const departDateTime = new Date(`${document.getElementById('date_depart').value}T${document.getElementById('heure_depart').value}`);
        const arriveeDateTime = new Date(`${document.getElementById('date_arrivee').value}T${document.getElementById('heure_arrivee').value}`);
        const now = new Date();

        if (!depart || !arrivee) {
            messages.push("Veuillez sélectionner une agence de départ et d'arrivée.");
        }
        if (departDateTime <= now) {
            messages.push("La date de départ doit être dans le futur.");
        }
        if (arriveeDateTime <= departDateTime) {
            messages.push("La date d'arrivée doit être après la date de départ.");
        }

        if (messages.length > 0) {
            document.querySelector('.paramsMessage').innerHTML = messages
                .map(msg => `<p style="color:red;">${msg}</p>`)
                .join('');
            return;
        }

        // 📦 Préparation des données
        const payload = {
            id_trajet: document.getElementById('id_trajet').value.trim(),
            id_user: document.getElementById('id_user').value.trim(),
            id_agence_depart: depart,
            date_depart: document.getElementById('date_depart').value.trim(),
            heure_depart: document.getElementById('heure_depart').value.trim(),
            id_agence_arrivee: arrivee,
            date_arrivee: document.getElementById('date_arrivee').value.trim(),
            heure_arrivee: document.getElementById('heure_arrivee').value.trim(),
            place: document.getElementById('place').value.trim()
        };

        const isUpdate = payload.id_trajet !== '';
        const endpoint = isUpdate ? '/admin/menu/update' : '/admin/menu/create';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success && result.successMessage) {
                showMessage(result.successMessage, 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // ✅ Redirection différée
                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            } else if (!result.success && result.errorMessage) {
                showMessage(result.errorMessage, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            }

        } catch (err) {
            console.error("❌", err.message || err);
        }
    });

    // 🗑️ Suppression d’un trajet
    document.querySelectorAll('.inputDelete').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('id_trajet').value = button.dataset.idtrajet;
            document.getElementById('globalDeleteForm').dispatchEvent(new Event('submit'));
        });
    });

    const deleteForm = document.getElementById('globalDeleteForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', async e => {
            e.preventDefault();
            const id = document.getElementById('id_trajet').value.trim();

            try {
                const response = await fetch('/admin/menu/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_trajet: id })
                });
                const result = await response.json();

                if (result.success && result.successMessage) {
                    showMessage(result.successMessage, 'success');
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // ✅ Redirection différée
                    setTimeout(() => {
                        window.location.href = '/admin/menu';
                    }, 3000);
                } else if (!result.success && result.errorMessage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    setTimeout(() => {
                        window.location.href = '/admin/menu';
                    }, 3000);
                }

            } catch (error) {
                console.error("❌ Suppression :", error.message || error);
            }
        });
    }


















    // 📖 Affichage des informations utilisateur dans une modale


    /**
 * @module adminMenuAgenceJS
 * @description Gère l’interface client pour l’administration des agences et l’affichage d'informations utilisateur en modale.
 *
 * @features
 * 📖 Affichage d’un utilisateur dans une modale
 * - Récupère les données via une route `/admin/menu/modale/:idUser`
 * - Affiche nom, téléphone, email et nombre de places dans la modale
 * - Gère l’ouverture/fermeture de la modale (bouton & click extérieur)

 * 🏢 Création et mise à jour d’une agence
 * - Envoie le formulaire vers `/admin/menu/agence/create` ou `/update` selon présence de l’ID
 * - Affiche message de retour via `showMessage`
 * - Redirige vers `/admin/menu` après succès/échec

 * ✏️ Pré-remplissage du formulaire d’agence
 * - Récupère les données de la ligne du tableau via `data-*`
 * - Injecte dans le formulaire d’édition et scroll jusqu’à lui

 * 🗑️ Suppression d’une agence
 * - Récupère l’ID via `data-idagence` et envoie vers `/admin/menu/agence/delete`
 * - Gère affichage des messages et redirection post-action
 *
 * @notes
 * - Tous les fetchs utilisent le format JSON et manipulent les champs standard : `success`, `successMessage`, `errorMessage`
 * - `showMessage` gère l’affichage visuel temporaire en haut de page
 */

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




    // 🏢 Formulaire de création ou mise à jour d'agence

    document.getElementById('formAgenceEdit').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('id_agence').value.trim();
        const agence = document.getElementById('agence').value.trim();

        if (!agence) {
            return;
        }

        const endpoint = id ? '/admin/menu/agence/update' : '/admin/menu/agence/create';
        const payload = id ? { id_agence: id, agence } : { agence };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success && result.successMessage) {
                showMessage(result.successMessage, 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // ✅ Redirection différée
                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            } else if (!result.success && result.errorMessage) {
                showMessage(result.errorMessage, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            }


        } catch (err) {
            console.error("❌", err.message || err);
        }
    });


    //pre remplir le formulaire d'édition d'agence

    document.querySelectorAll('.btn_admin.edit').forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr'); // ⬅️ récupère la ligne du tableau

            const agence = row.querySelector('[data-agence]').dataset.agence;
            const id = row.querySelector('[data-idAgence]').dataset.idagence;

            // Injection dans le formulaire
            document.getElementById('id_agence').value = id;
            document.getElementById('agence').value = agence;

            // Scroll fluide vers le formulaire
            document.getElementById('formAgenceEdit').scrollIntoView({ behavior: 'smooth' });
        });
    });

    //cible le bouton delete et recupere l'id_agence
    document.querySelectorAll('.table_agence-gen .inputDelete').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.idagence;
            document.getElementById('delete_id_agence').value = id;
            document.getElementById('agenceDeleteForm').dispatchEvent(new Event('submit'));
        });
    });






    // 🗑️ Formulaire de suppression d'agence

    document.getElementById('agenceDeleteForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('delete_id_agence').value.trim();

        if (!id) {
            return;
        }

        try {
            const response = await fetch('/admin/menu/agence/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_agence: id })
            });

            const result = await response.json();

            if (result.success && result.successMessage) {
                showMessage(result.successMessage, 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // ✅ Redirection différée
                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            } else if (!result.success && result.errorMessage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    window.location.href = '/admin/menu';
                }, 3000);
            }


        } catch (err) {
            console.error("❌", err);
        }
    });




});