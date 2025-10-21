// app.js
const express = require('express');
const cors = require('cors'); //es para habilitar que el puerto 4200 pueda acceder al puerto 3000
const player = require('./src/models/player');
const app = express();
const playerRoutes = require('./src/routes/players');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');
const passwordResetRoutes = require('./src/routes/password-reset');
const passwordVerifyRoutes = require('./src/routes/password-verify');

// Parseo de JSON antes de cualquier middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para logging de peticiones
app.use((req, res, next) => {
  console.log('\n--- Nueva Petición ---');
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', {
    'content-type': req.get('content-type'),
    'authorization': req.get('authorization') ? 'present' : 'not present'
  });
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  next();
});

// Error handling para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error en el parseo de JSON:', err);
    return res.status(400).json({ 
      message: 'JSON malformado',
      error: err.message 
    });
  }
  next();
});

require('./src/config/passport')(passport);
app.use('/api/players', playerRoutes);
app.use('/auth', authRoutes);
app.use('/auth', passwordResetRoutes);
app.use('/auth', passwordVerifyRoutes);


app.options('/api/players', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});




// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor corriendo en el puerto:.. ${PORT}`);
});
