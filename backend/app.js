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

const app = express();

// middlewares de sécurité
app.use(helmet());
app.use(
  cors({
    origin: 'https://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json({ limit: '10kb' }));

// limitation du nombre de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

// log des requêtes
app.use((req, res, next) => {
  logger.info(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// routes principales
app.use('/auth', authRoutes);
app.use('/qr', qrRoutes);
app.use('/conso', consoRoutes);


app.get('/', (req, res) => {
  res.send('API de QR Ticket sécurisée fonctionne');
});

module.exports = app;
