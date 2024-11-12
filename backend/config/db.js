const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost:3000',
  user: 'root', // utilisateur MySQL
  password: '',//mde passe MySQL
  database: 'db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;
