require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const consoRoutes = require('./routes/consoRoutes');
const winston = require('winston');

const app = express();

// Initialisation des logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

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

// nombre de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

// Log des requêtes
app.use((req, res, next) => {
  logger.info(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Routes principales
app.use('/auth', authRoutes);
app.use('/qr', qrRoutes);
app.use('/conso', consoRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.send('API de QR Ticket sécurisée fonctionne');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

module.exports = app;
