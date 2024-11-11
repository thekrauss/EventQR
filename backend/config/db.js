const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Remplace par ton utilisateur MySQL
  password: '', // Remplace par ton mot de passe MySQL
  database: 'nom_de_ta_base', // Nom de la base de données
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;
