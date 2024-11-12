const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Conn à la base de données


/*------------------------------------------------------------------------------------------*/
//inscription
const registerUser = async (req, res) => {
  const { nom, pseudo, password, sexe, adresse_mail, code_pays, numero } = req.body;

  //complexité du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre, et un caractère spécial.' });
  }

  //l'utilisateur existe déjà
  db.query('SELECT * FROM Users WHERE pseudo = ? OR adresse_mail = ?', [pseudo, adresse_mail], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de base de données' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Pseudo ou adresse mail déjà utilisés' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // insertion de l'utilisateur dans la base de données
    db.query('INSERT INTO Users (Nom, pseudo, password, sexe, adresse_mail, code_pays, numero) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [nom, pseudo, hashedPassword, sexe, adresse_mail, code_pays, numero], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
        }

        // Créer le token JWT
        const userId = results.insertId;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
          message: 'Utilisateur inscrit avec succès',
          token,
        });
      });
  });
};

/*------------------------------------------------------------------------------------------*/


// connexion
const loginUser = (req, res) => {
  const { pseudo, password } = req.body;

  // existance de l'utilisateur
  db.query('SELECT * FROM Users WHERE pseudo = ?', [pseudo], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de base de données' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    // compare le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // crée un token JWT
    const token = jwt.sign({ id: user.Id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Connexion réussie',
      token,
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
