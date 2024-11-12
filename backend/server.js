require('dotenv').config();
const app = require('./app'); 
const port = process.env.PORT || 3000;

const ColorBlue = "\x1b[34m";
const ColorGreen = "\x1b[32m";
const ColorYellow = "\x1b[33m";
const ColorRed = "\x1b[31m";
const ColorReset = "\x1b[0m";

const server = app.listen(port, () => {
  console.log(`${ColorBlue}Serveur démarré sur le port ${port}${ColorReset}`);
  console.log(`${ColorGreen}[INFO] : Pour arrêter le serveur : Ctrl + c${ColorReset}`);
});

// arrête le serveur proprement
const shutdown = (signal) => {
  console.log(`${ColorYellow}\nSignal reçu : ${signal}. Arrêt du serveur...${ColorReset}`);
  server.close(() => {
    console.log(`${ColorRed} connexions fermées. Serveur arrêté.${ColorReset}`);
    process.exit(0);
  });
};

//  signaux d'interruption
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
