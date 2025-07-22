# 🚗 Devoir Klaxon Covoit

Application web intranet pour la gestion des trajets inter-sites d'entreprise et la promotion du covoiturage.

---

## 🎯 Objectif

Réduire les déplacements individuels et optimiser les trajets inter-agences grâce à une plateforme collaborative.

**Fonctionnalités principales :**
- Proposer et réserver des trajets
- Gestion des agences par un administrateur
- Affichage des trajets à venir avec places disponibles

---

## 🛠 Fonctionnalités

- Liste des trajets disponibles (public)
- Authentification via JWT
- Création, modification, suppression de trajets
- Gestion des agences par un administrateur
- Initialisation sécurisée du mot de passe
- Gestion du token via cookie HTTP-only

---

## 🧩 Technologies utilisées

### Node.js (Front-end & API Express)
- `express` : serveur HTTP
- `sequelize` : ORM MySQL
- `ejs` : moteur de templates
- `dotenv`, `cookie-parser`, `express-session` : gestion des sessions et configuration
- `jsonwebtoken`, `bcrypt` : authentification
- `sass`, `concurrently`, `nodemon` : outils de développement

### PHP (Back-end & Logiciel métier)
- Insertion de données :  
  * Les données doivent être placées dans `xampp/mysql/data/klaxon` pour une utilisation locale  
  * Script d'insertion utilisateur : `src/database/insertData.sql`  
  * Fichiers data disponibles dans `public/csv/..`
- `phpunit` : tests unitaires
- `phpstan` : analyse statique
- Architecture PSR-4 avec autoload Composer

---

## ⚡ Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/tonbe/devoir_klaxon_covoit.git
   cd devoir_klaxon_covoit
   ```

   !Attention veillez a bien créer un fichier ,env a la racine du projet avec le modèle ci-dessous : 

DB_HOST=localhost
DB_USER=votre_user
PORT=3000
DB_PASSWORD=votre_password
DB_NAME=nom_de_la_base
SECRET_KEY=clé_secrète_jwt

2. **Installer les dépendances**
   - Node.js  
     ```bash
     npm install
     ```
   - PHP  
     ```bash
     composer install
     ```

---

## 🚀 Scripts utiles

| Commande           | Description                                 |
|--------------------|---------------------------------------------|
| `npm run dev`      | Lance le serveur Express + Sass en watch    |
| `npm run start`    | Démarre uniquement Express                  |
| `npm run sass`     | Compile main.scss en CSS                    |
| `composer test`    | Lance les tests PHPUnit                     |
| `composer analyse` | Exécute PHPStan                             |

---

## 🧪 Tests

- Les tests PHPUnit utilisent SQLite en mémoire
- Aucune configuration nécessaire
- Les tables sont créées automatiquement via `BaseTestCase.php`

---

## 📁 Architecture

```
/src        : Code PHP (services)
/tests      : Tests PHPUnit
/public     : Fichiers statiques CSS / JS
/views      : Templates EJS
/src/app.js : Point d’entrée Node.js
/.env       : Configuration locale (non incluse)
```

---

## 🔜 À venir

- Ajout de la réservation d'une place
- Notifications internes
- Export PDF des trajets planifiés

---

## 👨‍💻 Auteur

- **Nom** : Lecoultre Jean
- **Email** : lecoultre.dev85@example.com

---

## 🧑‍💼 Contexte pédagogique

Projet réalisé dans le cadre d’un devoir :  
**"TOUCHE PAS AU KLAXON"** – application de covoiturage entreprise.

---

## 💡 Suggestions

N’hésite pas à améliorer :
- Le système de rôle avec RBAC
- Le front avec Vue.js ou React
- L’ajout d’une API REST pour mobile

---

## 📄 Licence

Ce projet est sous licence MIT.