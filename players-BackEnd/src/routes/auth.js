const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();
const secret = 'claveSecretaQueSoloElServerConoce';


router.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  if (usuario === 'usuario' && password === 'xdev') {
    const token = jwt.sign({ usuario: usuario }, secret);
    res.json({ token: token });
    console.log("Autenticación exitosa.")
  } else {
    res.status(401).json({ mensaje: 'Autenticación fallida' });
  }
});

module.exports = router;
