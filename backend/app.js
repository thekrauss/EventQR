require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const authRoutes = require('./routes/authRoutes');
//const qrRoutes = require('./routes/qrRoutes');
//const consoRoutes = require('./routes/consoRoutes');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(
  cors({
    origin: 'https://mon-frontend.com',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json({ limit: '10kb' }));

// limitation  nombre de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

// routes principales
app.use('/auth', authRoutes);
//app.use('/qr', qrRoutes);
//app.use('/conso', consoRoutes);

// Route par défaut pour tester le serveur
app.get('/', (req, res) => {
  res.send('API de QR Ticket sécurisée fonctionne');
});

// gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

module.exports = app;
