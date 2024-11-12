const express = require('express');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/conso', (req, res) => {
    res.json({ message: 'Accès à une route protégée', userId: req.userId });
});
  