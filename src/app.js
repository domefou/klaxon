const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Sequelize
const sequelize = require('./config/sequelize');
const { Op } = require('sequelize');
sequelize.Op = Op;

// Port
const PORT = process.env.PORT || 3000;

// vues EJS
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));


// Middleware de session
const sessionMiddleware = require('./config/session'); // ou ./middleware/session
app.use(sessionMiddleware);




const accueilRoutes = require('./routes/public/accueil');
const loginRoutes = require('./routes/public/login');
const initPasswordRoutes = require('./routes/public/initPassword');
const logoutRoutes = require('./routes/public/logout');

const adminMenu = require('./routes/private/admin/menu');
const adminCreate = require('./routes/private/admin/create');
const adminDelete = require('./routes/private/admin/delete');
const adminUpdate = require('./routes/private/admin/update');

const adminModale = require('./routes/private/admin/modale'); // Ajout de la route pour la modale

const adminAgenceCreate = require('./routes/private/admin/agenceCreate');
const adminAgenceUpdate = require('./routes/private/admin/agenceUpdate');
const adminAgenceDelete = require('./routes/private/admin/agenceDelete');



const userMenu = require('./routes/private/user/menu');
const userCreate = require('./routes/private/user/create');
const userDelete = require('./routes/private/user/delete');
const userUpdate = require('./routes/private/user/update');
const userModale = require('./routes/private/user/modale'); // Ajout de la route pour la modale


app.use('/accueil', accueilRoutes);
app.use('/login', loginRoutes);
app.use('/initPassword', initPasswordRoutes);
app.use('/logout', logoutRoutes);

app.use('/admin/menu', adminMenu);
app.use('/admin/menu/create', adminCreate);
app.use('/admin/menu/delete', adminDelete);
app.use('/admin/menu/update', adminUpdate);

app.use('/admin/menu/modale', adminModale); // Ajout de la route pour la modale

app.use('/admin/menu/agence/create', adminAgenceCreate);
app.use('/admin/menu/agence/update', adminAgenceUpdate);
app.use('/admin/menu/agence/delete', adminAgenceDelete);



app.use('/user/menu', userMenu);
app.use('/user/menu/create', userCreate);
app.use('/user/menu/delete', userDelete);
app.use('/user/menu/update', userUpdate);
app.use('/user/menu/modale', userModale); // Ajout de la route pour la modale







// ⚙️ Synchronisation Sequelize + Démarrage du serveur
sequelize.sync()
    .then(() => {
        console.log('✅ Tables synchronisées avec succès');

        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Erreur de synchronisation :', err);
    });


